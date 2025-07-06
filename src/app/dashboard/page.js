// app/dashboard/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Loader2, Plus } from "lucide-react";
import { Popover } from "@/components/ui/popover";
import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CreateCampaignDropdown from "@/components/dashboard/ui/create-campaign";

export default function DashboardPage() {
  const router = useRouter();
  const [campaignName, setCampaignName] = useState("");
  const [budget, setBudget] = useState("");
  const [objective, setObjective] = useState("");
  const [seedKeywords, setSeedKeywords] = useState("");
  const [matchTypes, setMatchTypes] = useState({
    broad: true,
    phrase: false,
    exact: false,
    modified: false,
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currency, setCurrency] = useState("CAD");

  const handleMatchType = (type) => {
    setMatchTypes((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!seedKeywords.trim()) {
      setError("Enter at least one seed keyword");
      return;
    }
    const types = Object.entries(matchTypes)
      .filter(([, v]) => v)
      .map(([k]) => k);
    setLoading(true);
    try {
      const res = await fetch("/api/keywords/explore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seedKeywords: seedKeywords.split(",").map((k) => k.trim()),
          matchTypes: types,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setResults(data.keywords);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <div className="p-6  mx-4 w-full flex justify-between items-center">
        <div className="">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-sm text-gray-500">
            View and manage your campaigns
          </p>
        </div>
        <CreateCampaignDropdown />

        {/* {results.length > 0 && (
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle>Keyword Insights</CardTitle>
              <CardDescription>Review and refine your strategy</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {results.map((kw, i) => (
                  <li key={i} className="flex justify-between p-2 border-b">
                    <span>{kw.text}</span>
                    <Badge>{kw.matchType}</Badge>
                    <span>{kw.searchVolume.toLocaleString()}</span>
                    <span>${(kw.avgCpcMicros / 1e6).toFixed(2)}</span>
                    <span>{(kw.competition * 100).toFixed(0)}%</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )} */}
      </div>
    </main>
  );
}
