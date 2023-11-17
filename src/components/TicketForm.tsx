"use client";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import ImageUpload from "./ImageUpload";
import { uploadToS3 } from "@/lib/s3";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "./ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ticketFormSchema = z.object({
  user: z.string(),
  device: z.string().min(1),
  incident: z.string().min(1),
  description: z.string().min(1),
  status: z.string(),
});

type Props = {};

const TicketForm = (props: Props) => {
  const [isUploading, setIsUploading] = useState(false);
  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      user,
      device,
      incident,
      description,
      status,
      imageUrl,
    }: {
      user: string;
      device: string;
      incident: string;
      description: string;
      status: string;
      imageUrl: string;
    }) => {
      const options = {
        method: "POST",
        body: JSON.stringify({
			user,
			device,
			incident,
			description,
			status,
			imageUrl
		}),
      };
      const res = await fetch("/api/ticket/create", options);
      const data = res.json();
      console.log(data);
      return data;
    },
  });

  const [image, setImage] = useState(new File([], ""));

  const form = useForm<z.infer<typeof ticketFormSchema>>({
    resolver: zodResolver(ticketFormSchema),
    defaultValues: {
      user: "",
      device: "",
      incident: "None",
      description: "",
      status: "Open",
    },
  });

  const onSubmit = async (values: z.infer<typeof ticketFormSchema>) => {
    setIsUploading(true);
    console.log(values);
    console.log(image);
    try {
      const s3Res = await uploadToS3(image);
      if (!s3Res?.imageUrl) {
        console.log(s3Res);
        toast.error("something went wrong");
      }

      const ticketData = {
        ...values,
        imageUrl: s3Res!.imageUrl,
      };

      mutate(ticketData, {
        onSuccess: (data) => {
          toast.success(data.message);
        },
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
	onReset();
  };

  const onReset = () => {
    form.reset();
	onClearImage();
  };

  const onClearImage = () => {
    setImage(new File([], ""));
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        onReset={onReset}
        className="space-y-8"
      >
        <div className='flex w-full text-left justify-evenly'>
          <FormItem className="w-full">
            <FormLabel>Device's Information</FormLabel>
            <FormDescription>
              Serial Number
            </FormDescription>
            <Input disabled />
            <FormDescription>
              Model
            </FormDescription>
            <Input disabled />
            <FormMessage />
          </FormItem>
          <FormItem className="w-full">
            <FormLabel>User's Information</FormLabel>
            <FormDescription>
              First Name
            </FormDescription>
            <Input disabled />
            <FormDescription>
              Last Name
            </FormDescription>
            <Input disabled />
            <FormMessage />
          </FormItem>
        </div>
        <FormField
          control={form.control}
          name="incident"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Incident</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="None">None</SelectItem>
                    <SelectItem value="Cracked Glass & LCD">
                      Cracked Glass & LCD
                    </SelectItem>
                    <SelectItem value="Cracked Glass">Cracked Glass</SelectItem>
                    <SelectItem value="Damaged LCD">Damaged LCD</SelectItem>
                    <SelectItem value="Lost Device">Lost Device</SelectItem>
                    <SelectItem value="Device Failure">
                      Device Failure
                    </SelectItem>
                    <SelectItem value="Bent Device">Bent Device</SelectItem>
                    <SelectItem value="Headphone Jack">
                      Headphone Jack
                    </SelectItem>
                    <SelectItem value="Water Damage">Water Damage</SelectItem>
                    <SelectItem value="Lightning Port">
                      Lightning Port
                    </SelectItem>
                    <SelectItem value="Rework">Rework</SelectItem>
                    <SelectItem value="Loaner iPad">Loaner iPad</SelectItem>
                    <SelectItem value="Dead Battery">Dead Battery</SelectItem>
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
                <Textarea placeholder="shit broken" {...field} />
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
                <Select onValueChange={field.onChange} defaultValue="Open">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Unrepairable">Unrepairable</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormItem>
          <FormLabel>Image</FormLabel>
          <div className="flex justify-center items-center gap-8 h-32 w-full">
            {image.name !== "" ? (
              <>
                <div className="relative h-full">
                  <img
                    className="h-full rounded-xl object-cover"
                    src={URL.createObjectURL(image)}
                    alt="preview-upload"
                  />
                  <Button
                    onClick={onClearImage}
                    className="absolute p-0 h-8 w-8 rounded-full top-0 left-0 bg-slate-700 opacity-20"
                  >
                    <X />
                  </Button>
                </div>
              </>
            ) : (
              <ImageUpload setImage={setImage} />
            )}
          </div>
        </FormItem>
        <Button disabled={isPending || isUploading} type="submit">
          Create
        </Button>
        <Button disabled={isPending || isUploading} type="reset">
          Clear
        </Button>
      </form>
    </Form>
  );
};

export default TicketForm;
