'use client'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import ImageUpload from './ImageUpload'
import { uploadToS3 } from '@/lib/s3'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from './ui/form'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const ticketFormSchema = z.object({
	user: z.string(), 
	device: z.string().min(1),
	incident: z.string().min(1),
	description: z.string().min(1),
	status: z.string()
})

type Props = {}

const TicketForm = (props: Props) => {
	const { mutate, isPending } = useMutation({
	mutationFn: async (
	{
		file_key,
		file_name
	}: {
		file_key: string,
		file_name: string
	}) => {
		const options = {
			method: 'POST',
			body: JSON.stringify({ file_key, file_name })
		}
		const res = await fetch('/api/ticket/create', options)
		const data = res.json()
		console.log(data)
		return data
	}})

	const [image, setImage] = useState(new File([], ''))

	const form = useForm<z.infer<typeof ticketFormSchema>>({
		resolver: zodResolver(ticketFormSchema),
		defaultValues: {
			user: "", 
			device: "",
			incident: "None",
			description: "",
			status: "Open"
		}
	})

	const onSubmit = (values: z.infer<typeof ticketFormSchema>) => {
		console.log(values)
		console.log(image)
		form.reset()
	}

	const onReset = () => {
		form.reset()
	}

  return (
    <Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} onReset={onReset} className='space-y-8'>
				<FormField
					control={form.control}
					name="user"
					render={({ field }) => (
						<FormItem>
							<FormLabel>User's Name</FormLabel>
							<FormControl>
								<Input placeholder='alex smith' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="device"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Device's Serial Number</FormLabel>
							<FormControl>
								<Input placeholder='DV76KHQFK05' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="incident"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Incident</FormLabel>
							<FormControl>
								<Select onValueChange={field.onChange} defaultValue='None' >
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='None'>None</SelectItem>
										<SelectItem value='Cracked Glass & LCD'>Cracked Glass & LCD</SelectItem>
										<SelectItem value='Cracked Glass'>Cracked Glass</SelectItem>
										<SelectItem value='Damaged LCD'>Damaged LCD</SelectItem>
										<SelectItem value='Lost Device'>Lost Device</SelectItem>
										<SelectItem value='Device Failure'>Device Failure</SelectItem>
										<SelectItem value='Bent Device'>Bent Device</SelectItem>
										<SelectItem value='Headphone Jack'>Headphone Jack</SelectItem>
										<SelectItem value='Water Damage'>Water Damage</SelectItem>
										<SelectItem value='Lightning Port'>Lightning Port</SelectItem>
										<SelectItem value='Rework'>Rework</SelectItem>
										<SelectItem value='Loaner iPad'>Loaner iPad</SelectItem>
										<SelectItem value='Dead Battery'>Dead Battery</SelectItem>
									</SelectContent>
								</Select>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Description</FormLabel>
							<FormControl>
								<Textarea placeholder='shit broken' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="status"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Incident</FormLabel>
							<FormControl>
								<Select onValueChange={field.onChange} defaultValue='Open' >
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='Open'>Open</SelectItem>
										<SelectItem value='Pending'>Pending</SelectItem>
										<SelectItem value='Unrepairable'>Unrepairable</SelectItem>
										<SelectItem value='Closed'>Closed</SelectItem>
									</SelectContent>
								</Select>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormItem>
					<FormLabel>Image</FormLabel>
					<div className='flex justify-center items-center gap-8 h-32 w-full'>
						{image.name !== '' ? 
							<img className='h-full rounded-xl object-cover'
								src={URL.createObjectURL(image)}
								alt='preview-upload' />
							:
							<ImageUpload setImage={setImage} />
						}
					</div>
				</FormItem>
				<Button disabled={isPending} type='submit'>Create</Button>
				<Button disabled={isPending} type='reset'>Clear</Button>
			</form>
		</Form>

  )
}

export default TicketForm