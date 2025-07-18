import React, { useState, useEffect } from "react";

/**
 * GoogleAdsEditorTable React Component
 *
 * This component takes a data object (matching the provided structure)
 * and displays it in a tabular format suitable for Google Ads Editor.
 * It dynamically generates rows where each row represents a keyword associated with an ad group,
 * along with the ad copy (headlines and descriptions) for that ad group, supporting
 * up to 15 headlines and 4 descriptions.
 * It also provides a "Copy All" button to copy the entire table data as tab-separated values
 * to the clipboard, ready for pasting into Google Ads Editor.
 *
 * @param {object} props - The component props.
 * @param {object} props.data - The input data object containing crawl, keywords, and adCopy information.
 * @param {object} props.data.data - The main data payload.
 * @param {object} props.data.data.crawl - Crawl data including title, metaDescription, mainText, wordCount, and sourceUrl.
 * @param {object} props.data.data.keywords - Keyword data including keywords and keywordGroups.
 * @param {object} props.data.data.adCopy - Ad copy data including adGroups, negativeKeywords, and meta information.
 */
const GoogleAdsEditorTable = ({ data }) => {
  // State to store the generated table rows
  const [tableRows, setTableRows] = useState([]);
  // State to control the visibility of the copy success message
  const [showCopyMessage, setShowCopyMessage] = useState(false);

  // Constants for the maximum number of headlines and descriptions supported
  const MAX_HEADLINES = 15;
  const MAX_DESCRIPTIONS = 4;

  /**
   * useEffect hook to process the input data and generate table rows.
   * This runs whenever the 'data' prop changes.
   */
  useEffect(() => {
    // Basic validation for input data, now accounting for the 'data' wrapper
    if (
      !data ||
      !data.data ||
      !data.data.adCopy ||
      !data.data.adCopy.adGroups
    ) {
      setTableRows([]); // Clear rows if data is invalid
      return;
    }

    const generatedRows = [];
    // Default campaign name, can be made configurable if needed
    const defaultCampaignName = "EV Charging Campaign";
    // Source URL from the crawl data, used as the Final URL for ads and keywords
    const sourceUrl = data.data.crawl.sourceUrl;

    // Iterate through each ad group in the adCopy section
    data.data.adCopy.adGroups.forEach((adGroup) => {
      const adGroupName = adGroup.theme; // The theme is used as the Ad Group name
      const headlines = adGroup.adHeadlines || []; // Ensure it's an array
      const descriptions = adGroup.adDescriptions || []; // Ensure it's an array

      // For each keyword within the current ad group, create a table row
      adGroup.keywords.forEach((keyword) => {
        const row = {
          campaign: defaultCampaignName,
          adGroup: adGroupName,
          keyword: keyword,
          maxCpc: "", // Max CPC is left blank for manual input in Google Ads Editor
          keywordFinalUrl: sourceUrl, // Keyword Final URL is typically the same as Ad Final URL
        };

        // Dynamically add headline properties
        for (let i = 0; i < MAX_HEADLINES; i++) {
          row[`headline${i + 1}`] = headlines[i] || "";
        }

        // Dynamically add description properties
        for (let i = 0; i < MAX_DESCRIPTIONS; i++) {
          row[`description${i + 1}`] = descriptions[i] || "";
        }

        row.finalUrl = sourceUrl; // Ad Final URL
        generatedRows.push(row);
      });
    });
    setTableRows(generatedRows); // Update the state with the generated rows
  }, [data]); // Dependency array: re-run effect if 'data' prop changes

  /**
   * Handles copying all table data to the clipboard in a tab-separated format.
   * This format is ideal for pasting directly into Google Ads Editor.
   */
  const handleCopyAll = () => {
    if (tableRows.length === 0) {
      return; // Do nothing if there are no rows to copy
    }

    // Define the base column headers
    const headers = [
      "Campaign",
      "Ad Group",
      "Keyword",
      "Max CPC",
      "Keyword Final URL",
    ];

    // Dynamically add headline headers
    for (let i = 0; i < MAX_HEADLINES; i++) {
      headers.push(`Headline ${i + 1}`);
    }

    // Dynamically add description headers
    for (let i = 0; i < MAX_DESCRIPTIONS; i++) {
      headers.push(`Description ${i + 1}`);
    }

    // Add the final URL header
    headers.push("Final URL");

    // Build the CSV content (tab-separated values)
    let csvContent = headers.join("\t") + "\n"; // Add headers as the first line
    tableRows.forEach((row) => {
      const rowValues = [
        row.campaign,
        row.adGroup,
        row.keyword,
        row.maxCpc,
        row.keywordFinalUrl,
      ];

      // Dynamically add headline values
      for (let i = 0; i < MAX_HEADLINES; i++) {
        rowValues.push(row[`headline${i + 1}`]);
      }

      // Dynamically add description values
      for (let i = 0; i < MAX_DESCRIPTIONS; i++) {
        rowValues.push(row[`description${i + 1}`]);
      }

      rowValues.push(row.finalUrl);
      csvContent += rowValues.join("\t") + "\n"; // Join values with tabs and add a newline for each row
    });

    try {
      // Create a temporary textarea element to hold the text to be copied
      const textarea = document.createElement("textarea");
      textarea.value = csvContent;
      document.body.appendChild(textarea); // Append to body to make it selectable
      textarea.select(); // Select the text
      document.execCommand("copy"); // Execute the copy command
      document.body.removeChild(textarea); // Remove the temporary textarea

      // Show a success message and hide it after 3 seconds
      setShowCopyMessage(true);
      setTimeout(() => setShowCopyMessage(false), 3000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
      // In a production application, you might display a user-friendly error message here
    }
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen font-sans">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Google Ads Editor Table
      </h1>

      {/* Copy All button */}
      <div className="flex justify-center mb-6">
        <button
          onClick={handleCopyAll}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
        >
          Copy All to Clipboard (Google Ads Editor Format)
        </button>
      </div>

      {/* Copy success message */}
      {showCopyMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg animate-fade-in-down z-50">
          Table data copied to clipboard!
        </div>
      )}

      {/* Conditional rendering for the table or a no-data message */}
      {tableRows.length > 0 ? (
        <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 bg-white">
            <thead className="bg-gray-100">
              <tr>
                {/* Fixed Table Headers */}
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg"
                >
                  Campaign
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Ad Group
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Keyword
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Max CPC
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Keyword Final URL
                </th>
                {/* Dynamically generated Headline Headers */}
                {[...Array(MAX_HEADLINES)].map((_, i) => (
                  <th
                    key={`h_header_${i}`}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Headline {i + 1}
                  </th>
                ))}
                {/* Dynamically generated Description Headers */}
                {[...Array(MAX_DESCRIPTIONS)].map((_, i) => (
                  <th
                    key={`d_header_${i}`}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Description {i + 1}
                  </th>
                ))}
                {/* Final URL Header */}
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg"
                >
                  Final URL
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Render table rows */}
              {tableRows.map((row, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row.campaign}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row.adGroup}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row.keyword}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row.maxCpc}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row.keywordFinalUrl}
                  </td>
                  {/* Dynamically rendered Headline Cells */}
                  {[...Array(MAX_HEADLINES)].map((_, i) => (
                    <td
                      key={`h_cell_${index}_${i}`}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {row[`headline${i + 1}`]}
                    </td>
                  ))}
                  {/* Dynamically rendered Description Cells */}
                  {[...Array(MAX_DESCRIPTIONS)].map((_, i) => (
                    <td
                      key={`d_cell_${index}_${i}`}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {row[`description${i + 1}`]}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row.finalUrl}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        // Message displayed when no data is available
        <p className="text-center text-gray-600 text-lg mt-8">
          No data available to display in the table.
        </p>
      )}

      {/* Styling for the component, including Inter font and fade-in animation */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        body {
          font-family: 'Inter', sans-serif;
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.5s ease-out forwards;
        }
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default GoogleAdsEditorTable; // Export the component for use in other files
