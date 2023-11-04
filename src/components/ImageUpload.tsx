'use client'
import { useDropzone } from 'react-dropzone'
import { Inbox } from 'lucide-react'
import toast from 'react-hot-toast'

const ImageUpload = () => {
	const { getRootProps, getInputProps } = useDropzone({
		maxFiles: 1,
		accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
		onDrop: (acceptedFiles) => {
			console.log(acceptedFiles)
		},
		onDropRejected: (fileRejections) => {
			if (fileRejections[0]?.errors[0]?.code) toast.error(fileRejections[0].errors[0].code)
		}
	})
  return (
    <div className='p-2 bg-white rounded-xl'>
			<div
				{...getRootProps({
						className: 'border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center'
					})}>
				<input {...getInputProps()} />
				<>
					<Inbox className='w-10 h-10 text-blue-500'/>
					<p className='mt-2 text-sm text-slate-400'>Drop Image Here</p>
				</>
			</div>
		</div>
  )
}

export default ImageUpload