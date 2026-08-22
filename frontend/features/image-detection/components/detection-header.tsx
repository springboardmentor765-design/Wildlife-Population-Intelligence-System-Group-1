"use client";

import { SlidersHorizontal, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";

import { PageHeader } from "@/components/shared/Pageheader";
import { PageActions } from "@/components/shared/PageActions";
import { SearchInput } from "@/components/shared/SearchInput";

export function DetectionHeader() {
  return (
    <PageHeader
      breadcrumb="Dashboard / Image Detection"
      title="Image Detection"
      description="Analyze wildlife camera trap images using AI-powered species detection and population monitoring."
    >
      <PageActions>
        <SearchInput placeholder="Search detections..." />

        <Button variant="outline">
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Filters
        </Button>

        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload Images
        </Button>
      </PageActions>
    </PageHeader>
  );
}