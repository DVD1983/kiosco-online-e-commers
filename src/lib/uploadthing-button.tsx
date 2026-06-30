"use client"

import { UploadButton as UTButton } from "@uploadthing/react"
import type { OurFileRouter } from "@/lib/uploadthing"

export const UploadButton = UTButton<OurFileRouter, "productImage">
