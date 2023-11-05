'use client'
import { useDropzone } from 'react-dropzone'
import { Inbox } from 'lucide-react'
import toast from 'react-hot-toast'
import { getS3Url, uploadToS3 } from '@/lib/s3'

const ImageUpload = () => {
	const { getRootProps, getInputProps } = useDropzone({
		maxFiles: 1,
		accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
		onDrop: async (acceptedFiles) => {
			if (acceptedFiles.length === 0) {
				toast.error('file type unsupported')
				return
			}
			const file = acceptedFiles[0]
			if (file.size > 8 *  1024 * 1024) {
				toast.error('10mb limit')
				return
			}
			try {
				const data = await uploadToS3(file)
				console.log('data', data)
				console.log(getS3Url(data?.file_key!))
			} catch (err) {
				console.error(err)
			}
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