export interface EditorialWorld {
  /**
   * Internal unique identifier
   */
  id: string;

  /**
   * Display name shown in UI
   */
  name: string;

  /**
   * Short description of the world
   */
  description: string;

  /**
   * Permanent identity of this Editorial World.
   * These characteristics define the world itself and should never change.
   */
  dna: {
    architecture: string[];
    environment: string[];
    lighting: string[];
    mood: string[];
    colors: string[];
    weather: string[];
    atmosphere: string[];
  };

  /**
   * Natural human behaviour inside this world.
   * These are NOT poses—they describe how people naturally exist here.
   */
  behaviours: string[];

  /**
   * How the model interacts with the environment.
   */
  interactions: string[];

  /**
   * Photographer's creative intent.
   */
  photographerIntent: string[];

  /**
   * Camera framing and composition language.
   */
  cameraLanguage: string[];

  /**
   * World-specific instructions for transforming
   * the Hero into a new editorial campaign.
   */
  heroInstructions: string[];

  /**
   * Non-negotiable rules unique to this world.
   */
  editorialRules: string[];

  /**
   * Things that must never appear in this world.
   */
  negativePrompts: string[];
}