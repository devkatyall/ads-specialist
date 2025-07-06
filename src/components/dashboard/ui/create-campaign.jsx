import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function CreateCampaignDropdown({ className }) {
  return (
    <Link className="w-full " href="/dashboard/create/google-ads">
      <Button className={cn(className, "cursor-pointer")}>
        <Plus className=" text-white mr-1" /> Create
      </Button>
    </Link>
  );
}
