"use client";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { PlusIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import toast from "react-hot-toast";

type Props = {
	hasToken: boolean
};

const jamfAuthSchema = z.object({
  username: z.string(),
  password: z.string(),
});

const JamfAuth = ({ hasToken }: Props) => {
	const [dialogOpen, setDialogOpen] = useState(false)

	const form = useForm<z.infer<typeof jamfAuthSchema>>({
		resolver: zodResolver(jamfAuthSchema),
		defaultValues: {
			username: "",
			password: "",
		},
	});

  const { mutate } = useMutation({
		mutationFn: async (jamfForm: {
			username: string;
      password: string;
    }) => {
			if (!hasToken) {
				const options = {
					method: "POST",
					body: JSON.stringify(jamfForm),
					headers: {
						"Content-Type": "application/json",
					},
				};
				const res = await fetch("/api/jamf/auth", options);
				const data = await res.json();
				console.log(data);
			}
    },
  });

  const onSubmit = (values: z.infer<typeof jamfAuthSchema>) => {
    mutate(values, {
      onSuccess: (data) => {
        toast.success("token received");
      },
			onError: (err) => {
        toast.error(err.message);
			},
    });
    onReset();
  };

  const onReset = () => {
    form.reset();
  };

  return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				onReset={onReset}
				className="float-right flex gap-4 py-4"
			>
				{ !hasToken ?
				<>
				<FormField
					control={form.control}
					name="username"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input placeholder="username" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input type="password" placeholder="password" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				</> : <>
				<h1>has token</h1>
				</>}
				<Button type="submit">Login</Button>
			</form>
		</Form>
  );
};

export default JamfAuth;
