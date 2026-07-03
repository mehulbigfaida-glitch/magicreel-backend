// ============================================================================
// MagicReel Campaign Engine V2
// visual-intelligence/visual.types.ts
// ============================================================================

/**
 * Visual Intelligence Types
 *
 * Responsibility:
 * ----------------
 * Describe WHAT the product looks like.
 *
 * No creative decisions.
 * No marketing decisions.
 * No prompt generation.
 *
 * These interfaces are consumed by:
 *
 * Visual Intelligence
 *          ↓
 * Campaign Director
 *          ↓
 * Creative Director
 *          ↓
 * Prompt Builder
 */

// -----------------------------------------------------------------------------
// Core Analysis
// -----------------------------------------------------------------------------

export interface VisualAnalysis {

    product: ProductProfile;

    colors: ColorProfile;

    material: MaterialProfile;

    construction: ConstructionProfile;

    silhouette: SilhouetteProfile;

    styling: StylingProfile;

    branding: BrandingProfile;

    craftsmanship: CraftsmanshipProfile;

    composition: CompositionProfile;

    quality: QualityProfile;

    opportunities: OpportunityProfile;
}

// -----------------------------------------------------------------------------
// Product
// -----------------------------------------------------------------------------

export interface ProductProfile {

    category: string;

    subCategory?: string;

    garmentType?: string;

    gender?: string;

    ageGroup?: string;

    usage?: string;
}

// -----------------------------------------------------------------------------
// Color Intelligence
// -----------------------------------------------------------------------------

export interface ColorProfile {

    dominant: string[];

    secondary: string[];

    accent: string[];

    harmony?: string;

    temperature?: "warm" | "cool" | "neutral";

    saturation?: "low" | "medium" | "high";

    contrast?: "low" | "medium" | "high";
}

// -----------------------------------------------------------------------------
// Material
// -----------------------------------------------------------------------------

export interface MaterialProfile {

    primary?: string;

    secondary?: string[];

    texture?: string;

    finish?: string;

    transparency?: string;

    reflectivity?: string;

    drape?: string;
}

// -----------------------------------------------------------------------------
// Construction
// -----------------------------------------------------------------------------

export interface ConstructionProfile {

    silhouette?: string;

    neckline?: string;

    sleeve?: string;

    hemline?: string;

    waistline?: string;

    closure?: string;

    fit?: string;
}

// -----------------------------------------------------------------------------
// Silhouette
// -----------------------------------------------------------------------------

export interface SilhouetteProfile {

    shape?: string;

    volume?: string;

    balance?: string;

    structure?: string;

    movement?: string;
}

// -----------------------------------------------------------------------------
// Styling
// -----------------------------------------------------------------------------

export interface StylingProfile {

    style?: string;

    occasion?: string;

    season?: string;

    layering?: string;

    accessoriesDetected: string[];

    stylingKeywords: string[];
}

// -----------------------------------------------------------------------------
// Branding
// -----------------------------------------------------------------------------

export interface BrandingProfile {

    visibleLogo: boolean;

    logoPosition?: string;

    brandElements: string[];

    signatureDetails: string[];
}

// -----------------------------------------------------------------------------
// Craftsmanship
// -----------------------------------------------------------------------------

export interface CraftsmanshipProfile {

    embroidery?: string;

    embellishments: string[];

    stitching?: string;

    print?: string;

    pattern?: string;

    luxuryIndicators: string[];

    handcraftedElements: string[];
}

// -----------------------------------------------------------------------------
// Composition
// -----------------------------------------------------------------------------

export interface CompositionProfile {

    focalPoint?: string;

    visualWeight?: string;

    symmetry?: string;

    balance?: string;

    dominantShape?: string;

    repeatingPatterns: string[];
}

// -----------------------------------------------------------------------------
// Quality Assessment
// -----------------------------------------------------------------------------

export interface QualityProfile {

    perceivedLuxury?: string;

    premiumScore?: number;

    craftsmanshipScore?: number;

    visualComplexity?: number;

    productionReadiness?: number;

    confidence?: number;
}

// -----------------------------------------------------------------------------
// Visual Opportunities
// -----------------------------------------------------------------------------

export interface OpportunityProfile {

    heroElement?: string;

    strongestVisualFeature?: string;

    supportingFeatures: string[];

    luxuryHighlights: string[];

    recommendedFocus: string[];

    preserveElements: string[];

    avoidChanges: string[];
}

// -----------------------------------------------------------------------------
// Visual Intelligence Result
// -----------------------------------------------------------------------------

export interface VisualIntelligenceResult {

    success: boolean;

    analysis: VisualAnalysis;

    processingTime?: number;

    engine: string;

    version: string;
}