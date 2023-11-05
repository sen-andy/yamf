'use client'
import { useDropzone } from 'react-dropzone'
import { Inbox } from 'lucide-react'
import toast from 'react-hot-toast'

type Props = {
	setImage: React.Dispatch<React.SetStateAction<File>>
}

const ImageUpload = ({ setImage }: Props) => {
	const { getRootProps, getInputProps } = useDropzone({
		maxFiles: 1,
		accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
		onDrop: async (acceptedFiles) => {
			if (acceptedFiles.length === 0) {
				toast.error('file type unsupported')
				return
			}
			const file = acceptedFiles[0]
			if (file.size > 10 *  1024 * 1024) {
				toast.error('10mb limit')
				return
			}
			setImage(file)
		}
	})

  return (
    <div className='bg-white w-full h-full rounded-xl'>
			<div
				{...getRootProps({
						className: 'h-full border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 flex justify-center items-center'
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