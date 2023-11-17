"use client"
 
import { ColumnDef } from "@tanstack/react-table"
 
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Ticket = {
  id: string,
  user_name: string,
  device_serial: string,
  incident: string,
  description: string,
  imageUrl: string,
  status: string,
  comments: string,
  createdAt: string,
  updatedAt: string,
}
 
export const columns: ColumnDef<Ticket>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
  },
  {
    accessorKey: "device_serial",
    header: "Serial Number",
  },
  {
    accessorKey: "user_name",
    header: "Username",
  },
  {
    accessorKey: "incident",
    header: "Incident",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "image_url",
    header: "Image",
  },
  {
    accessorKey: "status",
    header: "status",
  },
  {
    accessorKey: "comments",
    header: "comments",
  },

]
