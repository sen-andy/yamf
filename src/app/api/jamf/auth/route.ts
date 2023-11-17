import { getToken, getJamfDevice } from "@/lib/jamf" 
import { NextResponse } from "next/server"
import { cookies } from 'next/headers'

export const POST = async (req: Request, res: Response) => {
	try {
		const body = await req.json()
		const {username, password, serial, type } = body

			const jamfAuth = await getToken({username, password})
			if(jamfAuth.token === 'error') {
				NextResponse.json(
					{ message: "jamf authentication error" },
					{ status: 401 }
				)

			const expireTime = Date.now() - new Date(jamfAuth.expires).getTime()

			cookies().set("jamf_token", jamfAuth.token, { maxAge: expireTime })
			cookies().set("jamf_expires", jamfAuth.expires, { maxAge: expireTime })
		}
		const deviceInfo = await getJamfDevice({serial, token: jamfAuth.token, type: type })
		console.log(deviceInfo)
		NextResponse.json(
			{ data: deviceInfo },
			{ status: 200 }
		)
	} catch (err) {
		console.error(err)
		NextResponse.json(
			{ message: err },
			{ status: 500 }
		)
	}
}