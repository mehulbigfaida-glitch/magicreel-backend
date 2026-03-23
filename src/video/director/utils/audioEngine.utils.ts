// src/video/director/utils/audioEngine.utils.ts

import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

/**
 * TYPES
 */
export type DirectorVoiceGender = 'male' | 'female' | 'other' | 'unknown';

export interface DirectorVoiceProfile {
  id: string;
  label: string;
  description?: string;
  gender?: DirectorVoiceGender;
  locale?: string;
}

export interface DirectorAudioConfig {
  voiceId?: string;
  speed?: number;
  language?: string;
  maxSegmentChars?: number;
}

export interface DirectorTimelineSegment {
  id: string;
  index: number;
  text: string;
  startMs: number;
  endMs: number;
  approximateDurationMs: number;
  audioPath: string | null;
}

export interface DirectorVoiceoverTimeline {
  jobId: string;
  rawScript: string;
  totalDurationMs: number;
  segments: DirectorTimelineSegment[];
  config: DirectorAudioConfig;
  createdAt: string;
}

/**
 * HELPERS
 */
export const ensureDir = async (dirPath: string) => {
  await fs.promises.mkdir(dirPath, { recursive: true });
};

export const estimateDurationMs = (text: string, speed: number = 1.0): number => {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  if (!cleaned) return 0;

  const words = cleaned.split(' ').length;
  const baseWpm = 165;
  const effectiveWpm = baseWpm * speed;
  return Math.round((words / effectiveWpm) * 60000);
};

/**
 * Split text into chunks under maxSegmentChars.
 */
export const splitScriptIntoSegments = (
  script: string,
  maxChars: number
): { id: string; index: number; text: string }[] => {
  const output: { id: string; index: number; text: string }[] = [];
  const cleaned = script.replace(/\s+/g, ' ').trim();
  if (!cleaned) return output;

  const sentences = cleaned
    .split(/([.!?])\s+/)
    .reduce<string[]>((acc, part, idx) => {
      if (part.match(/[.!?]/) && idx > 0) {
        acc[acc.length - 1] = acc[acc.length - 1] + part;
      } else if (part.trim()) {
        acc.push(part.trim());
      }
      return acc;
    }, []);

  let buffer = '';

  for (const sentence of sentences) {
    const test = buffer ? `${buffer} ${sentence}` : sentence;

    if (test.length <= maxChars) {
      buffer = test;
      continue;
    }

    if (buffer) {
      output.push({
        id: `seg-${output.length + 1}`,
        index: output.length,
        text: buffer.trim(),
      });
      buffer = sentence;
    } else {
      let remain = sentence;
      while (remain.length > maxChars) {
        output.push({
          id: `seg-${output.length + 1}`,
          index: output.length,
          text: remain.slice(0, maxChars).trim(),
        });
        remain = remain.slice(maxChars);
      }
      buffer = remain.trim();
    }
  }

  if (buffer.trim()) {
    output.push({
      id: `seg-${output.length + 1}`,
      index: output.length,
      text: buffer.trim(),
    });
  }

  return output;
};

/**
 * Build timeline
 */
export const buildTimelineForScript = (
  jobId: string,
  script: string,
  config: DirectorAudioConfig
): DirectorVoiceoverTimeline => {
  const maxChars = config.maxSegmentChars || 380;
  const speed = config.speed || 1.0;

  const baseSegments = splitScriptIntoSegments(script, maxChars);
  let cursor = 0;

  const segments: DirectorTimelineSegment[] = baseSegments.map((s) => {
    const approx = estimateDurationMs(s.text, speed);
    const start = cursor;
    const end = start + approx;
    cursor = end;

    return {
      id: s.id,
      index: s.index,
      text: s.text,
      startMs: start,
      endMs: end,
      approximateDurationMs: approx,
      audioPath: null,
    };
  });

  return {
    jobId,
    rawScript: script,
    totalDurationMs: cursor,
    segments,
    config,
    createdAt: new Date().toISOString(),
  };
};

/**
 * Fetch OpenAI TTS audio for a segment
 */
export const generateRealAudioForSegment = async (
  text: string,
  outputPath: string
) => {
  const apiKey = process.env.OPENAI_API_KEY;

  const response = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini-tts",
      voice: "alloy",
      input: text,
      format: "mp3",
      speed: 1.0,
    }),
  });

  const arrayBuf = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuf);
  await fs.promises.writeFile(outputPath, buffer);
};

/**
 * Generate all audio segments
 */
export const generateRealAudioForTimeline = async (
  baseDir: string,
  timeline: DirectorVoiceoverTimeline
): Promise<DirectorVoiceoverTimeline> => {
  const safeJob = timeline.jobId.replace(/[^a-zA-Z0-9_-]/g, '');
  const jobDir = path.join(baseDir, safeJob);

  await ensureDir(jobDir);

  const updated = [];

  for (const seg of timeline.segments) {
    const filename = `${seg.id}-${randomUUID()}.mp3`;
    const output = path.join(jobDir, filename);

    await generateRealAudioForSegment(seg.text, output);

    updated.push({
      ...seg,
      audioPath: output,
    });
  }

  return {
    ...timeline,
    segments: updated,
  };
};

/**
 * Save timeline.json
 */
export const saveTimelineToDisk = async (
  baseDir: string,
  timeline: DirectorVoiceoverTimeline
): Promise<string> => {
  const safe = timeline.jobId.replace(/[^a-zA-Z0-9_-]/g, '');
  const folder = path.join(baseDir, safe);

  await ensureDir(folder);

  const file = path.join(folder, 'timeline.json');
  await fs.promises.writeFile(file, JSON.stringify(timeline, null, 2), 'utf8');
  return file;
};
