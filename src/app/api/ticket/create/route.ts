import { NextResponse } from "next/server"

// /api/ticket/create
export const POST = async (req: Request, res: Response) => {
	try {
		const body = req.json()
		// const {file_key, file_name} = body
	} catch (err) {
		console.error(err)
		return NextResponse.json(
			{ error: `internal server error` },
			{ status: 500 }
		)
	}
}