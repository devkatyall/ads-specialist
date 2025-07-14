"use client"; // Already present in your code

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Filter,
  ArrowUpDown,
  Download,
  Plus,
  MoreHorizontal,
  FileText,
  Calendar,
  Eye,
  Edit,
  Trash2,
  Copy,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dialog } from "@radix-ui/react-dialog";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AdCopyPage() {
  const [adCopyProjects, setAdCopyProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [selectedProjectIds, setSelectedProjectIds] = useState(new Set()); // For multi-select
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deletingProjectId, setDeletingProjectId] = useState(null);
  const [bulkopen, setBulkopen] = useState(false);

  useEffect(() => {
    fetchAdCopyProjects();
  }, []);

  const fetchAdCopyProjects = async () => {
    try {
      setLoading(true);
      setError(""); // Clear previous errors
      // *** IMPORTANT CHANGE: Update fetch endpoint to your new Firebase route ***
      const response = await fetch("/api/firebase/get-ad-copy");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // *** IMPORTANT CHANGE: Access 'adCopies' from the response data ***
      setAdCopyProjects(data.adCopies || []);
    } catch (error) {
      console.error("Error fetching ad copy projects:", error);
      setError("Failed to load ad copy projects. Please try again.");
      toast.error("Failed to load ad copy projects");
    } finally {
      setLoading(false);
    }
  };

  const filteredAdCopyProjects = adCopyProjects
    .filter((project) => {
      // Filter primarily by projectName, as 'type' and 'status' are not direct fields
      // You could also add filtering by 'description' or 'adCopies[0].headline' if desired
      const matchesSearch = project.projectName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (sortField === "createdAt") {
        // Firestore Timestamps need to be converted for comparison
        const aDate = aValue
          ? new Date(aValue._seconds * 1000 + aValue._nanoseconds / 1000000)
          : new Date(0); // Handle potential null/undefined
        const bDate = bValue
          ? new Date(bValue._seconds * 1000 + bValue._nanoseconds / 1000000)
          : new Date(0);
        return sortDirection === "asc"
          ? aDate.getTime() - bDate.getTime()
          : bDate.getTime() - aDate.getTime();
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      // Fallback for other types or if values are not directly comparable
      return sortDirection === "asc"
        ? aValue > bValue
          ? 1
          : -1
        : bValue > aValue
        ? 1
        : -1;
    });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleDeleteAdCopy = async (projectId) => {
    setOpen(false);
    if (!projectId) {
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
        body: JSON.stringify({ id: projectId }), // Send the ID in the request body
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      toast.success("Ad copy project deleted successfully!");
      // Redirect back to the ad copy list page after successful deletion
      setDeletingProjectId(null); // Clear selection regardless of full/partial success
      fetchAdCopyProjects();
    } catch (error) {
      console.error("Error deleting ad copy project:", error);
      toast.error(`Failed to delete project: ${error.message}`);
    }
  };

  const formatDate = (firestoreTimestamp) => {
    if (!firestoreTimestamp) return "N/A";
    // Convert Firestore Timestamp object to Date object
    const date = new Date(
      firestoreTimestamp._seconds * 1000 +
        firestoreTimestamp._nanoseconds / 1000000
    );
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleProjectAction = async (action, projectId) => {
    switch (action) {
      case "view":
        // Assuming you'll create a dynamic route like /dashboard/ad-copy/[id] for details
        router.push(`/dashboard/google-tools/ad-copy/${projectId}`);
        break;
      case "edit":
        toast.info("Opening ad copy editor...");
        // Implement navigation to an edit page if applicable
        break;
      case "duplicate":
        toast.info("Duplicating ad copy project...");
        // Implement duplication logic (e.g., call a backend route)
        break;
      case "delete":
        {
          setOpen(true);
          setDeletingProjectId(projectId);
        }
        break;
      default:
        break;
    }
  };

  const handleBulkDelete = async () => {
    toast.info(`Deleting ${selectedProjectIds.size} projects...`);
    try {
      // *** IMPORTANT: Ensure this matches your backend route name! ***
      // We'll use '/api/firebase/bulk-delete-ad-copies' as previously defined.
      const response = await fetch("/api/firebase//delete/bulk-ad-copy", {
        method: "POST", // As designed for your bulk delete API route
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: Array.from(selectedProjectIds) }),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Read error details from backend
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const responseData = await response.json(); // Get the successful response data

      // Check for partial success/failure feedback from the backend
      if (
        responseData.failedDeletions &&
        responseData.failedDeletions.length > 0
      ) {
        // If some deletions failed (e.g., not found, unauthorized)
        toast.warning(
          `Deleted ${responseData.deletedCount || 0} projects. ${
            responseData.failedDeletions.length
          } failed to delete.`
        );
        console.warn(
          "Failed deletions (not found or unauthorized):",
          responseData.failedDeletions
        );
      } else {
        // All selected projects were deleted successfully
        toast.success(
          responseData.message || "Selected projects deleted successfully!"
        );
      }

      setSelectedProjectIds(new Set()); // Clear selection regardless of full/partial success
      fetchAdCopyProjects(); // Re-fetch the updated list to reflect changes
    } catch (error) {
      console.error("Error deleting projects:", error);
      toast.error(`Failed to delete projects: ${error.message}`); // Display specific error message
    }
  };

  const toggleSelectAll = () => {
    if (selectedProjectIds.size === filteredAdCopyProjects.length) {
      setSelectedProjectIds(new Set()); // Deselect all
    } else {
      const newSelected = new Set(
        filteredAdCopyProjects.map((project) => project.id)
      );
      setSelectedProjectIds(newSelected); // Select all filtered
    }
  };

  const toggleSelectProject = (projectId) => {
    setSelectedProjectIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(projectId)) {
        newSet.delete(projectId);
      } else {
        newSet.add(projectId);
      }
      return newSet;
    });
  };

  const exportAdCopyProjects = () => {
    const csvContent = [
      [
        "Project Name",
        "Description", // Changed from Type/Category for accuracy
        "Status",
        "Number of Ad Copies", // Changed from Generated Ad Copies
        "Created Date", // Changed from Created
      ].join(","),
      ...filteredAdCopyProjects.map((project) =>
        [
          `"${project.projectName || ""}"`, // Enclose in quotes for CSV if content has commas
          `"${project.description || "N/A"}"`,
          "Generated", // Default status
          project.adCopies?.length || 0, // Get count from actual adCopies array
          formatDate(project.createdAt),
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ad_copy_projects.csv";
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Ad copy projects exported successfully!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {" "}
      {/* Added padding here for overall layout */}
      <div className="mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Ad Copy Projects
              <Badge variant="secondary" className="ml-2">
                {adCopyProjects.length}
              </Badge>
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your AI-generated advertising copy projects
            </p>
          </div>
          <div className="flex gap-3">
            {selectedProjectIds.size > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Trash2 className="h-4 w-4 mr-2" />
                    {`Actions (${selectedProjectIds.size})`}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => setBulkopen(true)}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Selected
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <Button variant="outline" onClick={exportAdCopyProjects}>
              <Download className="h-4 w-4 mr-2" />
              Download CSV
            </Button>
            <Link href="/dashboard/create/ad-copy">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Ad Copy Project
              </Button>
            </Link>
          </div>
        </div>
        {error && (
          <Card className="border-red-200 bg-red-50 p-0">
            <CardContent className="p-4">
              <p className="text-red-700 text-sm"> {error}</p>
            </CardContent>
          </Card>
        )}
        {/* Search and Filters */}
        <div className="flex items-center gap-4 mt-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search ad copy projects by name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          {/* Filter button can remain, but its logic needs to be implemented for new filters */}
          <Button variant="outline" size="sm" disabled>
            <Filter className="h-4 w-4 mr-2" />
            Filter (Coming Soon)
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleSort("projectName")}>
                Name{" "}
                {sortField === "projectName" &&
                  (sortDirection === "asc" ? "↑" : "↓")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort("createdAt")}>
                Date{" "}
                {sortField === "createdAt" &&
                  (sortDirection === "asc" ? "↑" : "↓")}
              </DropdownMenuItem>
              {/* Removed status from sort options as it's not a direct field */}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the selected ad copy projects?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                className="mr-2"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDeleteAdCopy(deletingProjectId)}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={bulkopen} onOpenChange={setBulkopen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Bulk Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the all selected ad copy
                projects?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setBulkopen(false)}
                className="mr-2"
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={() => handleBulkDelete()}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* Content table */}
        <Card className={"p-0"}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-4 w-12">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-blue-600 rounded"
                    checked={
                      selectedProjectIds.size ===
                        filteredAdCopyProjects.length &&
                      filteredAdCopyProjects.length > 0
                    }
                    onChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead>Project Name</TableHead>
                <TableHead>Description</TableHead> {/* Updated */}
                <TableHead>Status</TableHead>
                <TableHead>Number of Ad Copies</TableHead> {/* Updated */}
                <TableHead>Created Date</TableHead> {/* Updated */}
                <TableHead className="px-4"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAdCopyProjects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <FileText className="h-12 w-12 text-gray-400" />
                      <div className="mb-2">
                        <p className="text-gray-500 font-medium">
                          No ad copy projects found
                        </p>
                        <p className="text-gray-400 text-sm">
                          {searchTerm
                            ? "Try adjusting your search terms"
                            : "Create your first ad copy project to get started"}
                        </p>
                      </div>
                      {!searchTerm && (
                        <Link href="/dashboard/create/ad-copy">
                          <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Create Ad Copy
                          </Button>
                        </Link>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredAdCopyProjects.map((project) => (
                  <TableRow key={project.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium text-gray-500 px-4">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-blue-600 rounded"
                        checked={selectedProjectIds.has(project.id)}
                        onChange={() => toggleSelectProject(project.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <FileText className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <button
                            onClick={() =>
                              handleProjectAction("view", project.id)
                            }
                            className="font-medium text-gray-900 hover:text-blue-600 transition-colors text-left cursor-pointer"
                          >
                            {project.projectName || "Untitled Project"}
                          </button>
                          <p className="text-sm text-gray-500">
                            ID: {project.id}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {/* Display a truncated description or a static string */}
                      <span className="text-sm text-gray-600">
                        {project.description
                          ? project.description.length > 50
                            ? `${project.description.substring(0, 50)}...`
                            : project.description
                          : "N/A"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {/* Default status as "Generated" */}
                      <Badge
                        variant="default"
                        className="font-normal capitalize"
                      >
                        Generated
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {project.adCopies?.length || 0} copies
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {formatDate(project.createdAt)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              handleProjectAction("view", project.id)
                            }
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleProjectAction("edit", project.id)
                            }
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Project
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleProjectAction("duplicate", project.id)
                            }
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleProjectAction("delete", project.id)
                            }
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
