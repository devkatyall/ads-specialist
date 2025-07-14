"use client";
import SearchCampaignResults from "./SearchCampaignResults";
import DisplayCampaignResults from "./DisplayCampaignResults";
import ShoppingCampaignResults from "./ShoppingCampaignResults";
import VideoCampaignResults from "./VideoCampaignResults";
import PMaxCampaignResults from "./PMaxCampaignResults";
import AppCampaignResults from "../../global/CampaignResults";
import ConceptStrategiesResults from "./ConceptResult";

export default function CampaignResultsRouter({
  campaignName,
  campaignType,
  generatedAssets,
  onCreateAnother,
  date,
}) {
  // Check if this is concept strategies mode (has concepts array)
  const isConceptMode =
    generatedAssets?.concepts && Array.isArray(generatedAssets.concepts);

  // If concept mode, always show ConceptStrategiesResults regardless of campaign type
  if (isConceptMode) {
    return (
      <ConceptStrategiesResults
        campaignName={campaignName}
        date={date}
        generatedAssets={generatedAssets}
        onCreateAnother={onCreateAnother}
        campaignType={campaignType} // Pass campaign type for additional context
      />
    );
  }

  // Route to the appropriate component based on campaign type for regular campaigns
  switch (campaignType) {
    case "search":
      return (
        <SearchCampaignResults
          campaignName={campaignName}
          date={date}
          generatedAssets={generatedAssets}
          onCreateAnother={onCreateAnother}
        />
      );
    case "display":
      return (
        <DisplayCampaignResults
          campaignName={campaignName}
          date={date}
          generatedAssets={generatedAssets}
          onCreateAnother={onCreateAnother}
        />
      );
    case "shopping":
      return (
        <ShoppingCampaignResults
          campaignName={campaignName}
          date={date}
          generatedAssets={generatedAssets}
          onCreateAnother={onCreateAnother}
        />
      );
    case "video":
      return (
        <VideoCampaignResults
          campaignName={campaignName}
          date={date}
          generatedAssets={generatedAssets}
          onCreateAnother={onCreateAnother}
        />
      );
    case "pmax":
      return (
        <PMaxCampaignResults
          campaignName={campaignName}
          date={date}
          generatedAssets={generatedAssets}
          onCreateAnother={onCreateAnother}
        />
      );
    case "app":
      return (
        <AppCampaignResults
          campaignName={campaignName}
          date={date}
          generatedAssets={generatedAssets}
          onCreateAnother={onCreateAnother}
        />
      );
    default:
      return (
        <div className="text-center py-12">
          <div className="text-red-500 font-medium">
            Unknown campaign type: {campaignType}
          </div>
          <p className="text-gray-500 text-sm mt-2">
            Please contact support if this error persists.
          </p>
        </div>
      );
  }
}
