// app/dashboard/ad-copy/[id]/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation"; // For Next.js App Router
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowLeft, Copy, Delete, Star, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import Loader from "@/components/dashboard/global/Loader";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { set } from "date-fns";

export default function BasicAdCopyDetailPage() {
  const { copyId } = useParams(); // Get the dynamic ID from the URL (e.g., 'abc123def' if URL is /ad-copy/abc123def)
  const router = useRouter(); // For programmatic navigation (e.g., back button)

  const [adCopyData, setAdCopyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (copyId) {
      fetchAdCopyDetails(copyId);
    }
  }, [copyId]); // Depend on 'copyId' to re-fetch if it changes (though for a detail page it usually won't)

  const fetchAdCopyDetails = async (adCopyId) => {
    try {
      setLoading(true);
      setError(""); // Clear previous errors

      // Construct the URL for your new dynamic API route
      const response = await fetch(`/api/firebase/get-ad-copy/${adCopyId}`);

      if (!response.ok) {
        // Attempt to read error message from response body
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      setAdCopyData(data.adCopy); // Assuming your API returns { adCopy: {...} }
    } catch (err) {
      console.error("Error fetching ad copy details:", err);
      setError(`Failed to load ad copy details: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Helper to format Firestore Timestamps for display
  const formatDate = (firestoreTimestamp) => {
    if (!firestoreTimestamp || !firestoreTimestamp._seconds) return "N/A";
    const date = new Date(
      firestoreTimestamp._seconds * 1000 +
        firestoreTimestamp._nanoseconds / 1000000
    );
    return date.toLocaleString(); // Use local string for simplicity
  };

  if (loading) {
    return (
      <div
        style={{ padding: "20px", textAlign: "center" }}
        className="flex justify-center items-center"
      >
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px", color: "red" }}>
        <h2>Error Loading Ad Copy</h2>
        <p>{error}</p>
        <button
          onClick={() => router.back()}
          style={{ marginTop: "10px", padding: "8px 16px" }}
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!adCopyData) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>Ad Copy Not Found</h2>
        <p>No data found for ID: {copyId}</p>
        <button
          onClick={() => router.back()}
          style={{ marginTop: "10px", padding: "8px 16px" }}
        >
          Go Back
        </button>
      </div>
    );
  }

  const handleDeleteAdCopy = async () => {
    setOpen(false);
    if (!adCopyData || !adCopyData.id) {
      toast.error("No ad copy selected for deletion.");
      return;
    }
    toast.info("Deleting ad copy project...");
    try {
      const response = await fetch("/api/firebase/delete/ad-copy", {
        method: "DELETE", // Use DELETE HTTP method
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: adCopyData.id }), // Send the ID in the request body
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      toast.success("Ad copy project deleted successfully!");
      router.push("/dashboard/google-tools/ad-copy"); // Redirect back to the ad copy list page after successful deletion
    } catch (error) {
      console.error("Error deleting ad copy project:", error);
      toast.error(`Failed to delete project: ${error.message}`);
    }
  };

  // If data is loaded, display it
  return (
    <Card className="">
      {/* <Button onClick={() => router.back()} className={"w-fit"}>
        <ArrowLeft size={16} /> Back
      </Button> */}
      <CardHeader className={""}>
        <h2 className="text-sm uppercase font-semibold text-slate-400">
          Ad Copies ({adCopyData.adCopies?.length || 0})
        </h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl">
              {adCopyData.projectName || "Untitled Project"}
            </h1>
            <div className="flex gap-2 flex-wrap text-xs h-fit">
              <p className=" bg-orange-200 px-4 py-1 rounded-full flex items-center">
                <strong>Project ID: </strong> {adCopyData.id}
              </p>
              <p className=" bg-blue-200 px-4 py-1 rounded-full flex items-center">
                <strong>Created: </strong> {formatDate(adCopyData.createdAt)}
              </p>
            </div>
          </div>
          <Button
            variant={"outline"}
            className={"cursor-pointer hover:scale-105 transition-all"}
            onClick={() => {
              setOpen(true);
            }}
          >
            <Trash className="text-red-500 hover:text-red-600 cursor-pointer h-4 w-4" />
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
              <DialogTitle>
                <p>Delete {adCopyData.projectName}</p>
              </DialogTitle>
              <DialogDescription>
                <p>
                  You are about to delete {adCopyData.projectName}. This won't
                  be reversalble.
                </p>
              </DialogDescription>
              <DialogFooter>
                <Button
                  variant={"outline"}
                  onClick={() => setOpen(false)}
                  className={""}
                >
                  Cancel
                </Button>
                <Button onClick={handleDeleteAdCopy}>Delete</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {adCopyData.adCopies && adCopyData.adCopies.length > 0 ? (
            adCopyData.adCopies.map((copy, index) => (
              /// ad copy details

              <div
                key={index}
                className="p-4 border border-slate-300 shadow-md shadow-green-200 rounded-lg mb-4 space-y-2 flex flex-col"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs text-slate-400 ">
                    Ad Copy #{index + 1}
                  </h3>
                  <p
                    className="text-xs p-2 bg-slate-100 rounded-full cursor-pointer hover:text-slate-600"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        JSON.stringify(copy, null, 2)
                      );
                      toast(" Ad Copy is Copied!", { icon: "👏" });
                    }}
                  >
                    <Copy className="h-4 w-4 text-slate-400" />
                  </p>
                </div>
                <p
                  className="font-medium text-lg cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(copy.headline);
                    toast(" Heading is Copied!", { icon: "👏" });
                  }}
                >
                  {/* <strong className="text-sm block">Headline</strong>{" "} */}
                  {copy.headline}
                </p>
                <p
                  className="text-sm text-gray-600 cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(copy.description);
                    toast(" Description is Copied!", { icon: "👏" });
                  }}
                >
                  {copy.description}
                </p>
                <p
                  className="py-2 px-4 text-[13px] bg-green-200 rounded-full w-fit cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(copy.cta);
                    toast(" CTA is Copied!", { icon: "👏" });
                  }}
                >
                  {copy.cta}
                </p>

                <hr className="border-dashed border-gray-300 mt-auto mb-4" />

                <div className=" h-fit text-center">
                  {copy.rating &&
                    typeof copy.rating === "object" &&
                    copy.rating.score !== undefined && (
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="flex items-center justify-center mb-2 text-yellow-500 gap-1">
                            {[...Array(5)].map((_, i) =>
                              i < copy.rating.score ? (
                                <Star
                                  key={i}
                                  className="h-4 w-4 fill-yellow-400 stroke-yellow-500"
                                />
                              ) : (
                                <Star
                                  key={i}
                                  className="h-4 w-4 text-gray-300"
                                />
                              )
                            )}
                            <span className="ml-1 text-sm text-gray-500">
                              ({copy.rating.score}/5)
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent
                          className={"max-w-sm text-xs italic text-center"}
                        >
                          <p className="">{copy.rating.justification}</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                </div>
              </div>
            ))
          ) : (
            <p>No specific ad copy details available.</p>
          )}
        </div>
        <hr
          style={{ margin: "30px 0" }}
          className="border-dashed border-gray-300"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <p className="p-4 rounded-xl bg-green-100">
            <span className="block text-green-600 uppercase text-xs tracking-wide mb-2 ">
              Description
            </span>
            {adCopyData.description}
          </p>
          <p className="p-4 rounded-xl bg-cyan-100">
            <span className="block text-cyan-600  uppercase text-xs tracking-wide mb-2 ">
              Strategy
            </span>
            {adCopyData.strategicOverview}
          </p>
          <p className="p-4 rounded-xl bg-yellow-100">
            <span className="block text-yellow-600 uppercase text-xs tracking-wide mb-2 ">
              Creative Rationale
            </span>
            {adCopyData.creativeRationale}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
