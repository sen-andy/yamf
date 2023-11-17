'use client'

import React from 'react'
import { useQuery } from "@tanstack/react-query";
import { columns, Ticket } from './TicketTable/columns';
import { DataTable } from "./TicketTable/data-table";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import TicketForm from "@/components/TicketForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type Props = {}

const TicketTable = (props: Props) => {
  const { data, isLoading } = useQuery({
    queryKey: ["tickets"],
    queryFn: async () => {
      const res = await fetch("/api/ticket", { method: "GET" });
      const queryData = await res.json();
      console.log(queryData);
      return queryData;
    },
  });

  const testData = [
    {
      id: "7",
      user_name: "Sam Fisher",
      device_serial: "DW99970NKD91",
      incident: "Cracked Screen",
      description: "Shit broken",
      imageUrl: "",
      status: "open",
      comments: "comments",
      updatedAt: "",
    },
    {
      id: "3",
      user_name: "Kim Johnson",
      device_serial: "DW03970NKD91",
      incident: "Cracked Screen",
      description: "Shit yup it broke",
      imageUrl: "",
      status: "pending",
      comments: "comments",
      updatedAt: "",
    },
  ] as Ticket[]

	const openTicketForm = () => {
		
	}


  return (
		<div>
			{/* <Button onClick={openTicketForm} ><PlusIcon className='w-5 h-5' /> New Ticket</Button> */}
			<Dialog>
				<div className='py-4'>
					<DialogTrigger asChild><Button><PlusIcon className='w-5 h-5' /> New Ticket</Button></DialogTrigger>
				</div>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>New Ticket</DialogTitle>
						<TicketForm />
					</DialogHeader>
				</DialogContent>
			</Dialog>
			<DataTable data={testData} columns={columns} />
		</div>
  )
}

export default TicketTable