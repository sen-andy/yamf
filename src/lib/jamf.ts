const BASE_JAMF_API_URL = `${process.env.NEXT_PUBLIC_JAMF_URL}/JSSResource`;

export const getToken = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  const authUrl = `${process.env.NEXT_PUBLIC_JAMF_URL}/api/v1/auth/token`;
  const base64data = btoa(`${username}:${password}`);
  try {
    const options = {
      method: "POST",
      headers: {
        Authorization: `Basic ${base64data}`,
        Accept: "*/*",
        "Cache-Control": "no-cache",
        "Accept-Encoding": "gzip, deflate, br",
        Connection: "keep-alive",
        "Content-Length": "0",
      },
    };
    const res = await fetch(authUrl, options);
    const data = await res.json();
    return { token: data.token, expires: data.expires };
  } catch (err) {
    console.log(err);
    return { token: "error", expires: "error" };
  }
};

export const getJamfDevice = async ({
  token,
  serial,
  type,
}: {
  token: string;
  serial: string;
  type: string;
}) => {
	const isMobile = type === 'mobile'
  const serialUrl = `${BASE_JAMF_API_URL}/${isMobile ? 'mobiledevices' : 'computers'}/serialnumber/${serial}`;
  if (!token) throw Error("no token");
  try {
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Cache-Control": "no-cache",
        "Accept-Encoding": "gzip, deflate, br",
        Connection: "keep-alive",
      },
    };
    const deviceRes = await fetch(serialUrl, options);
    if (deviceRes.status !== 200) throw Error("device not found");

    const deviceData = await deviceRes.json();
    const device = {
			serial: deviceData[isMobile ? 'mobile_device': 'computer'].general.serial_number,
			jamfId: deviceData[isMobile ? 'mobile_device': 'computer'].general.id,
      model: isMobile ? deviceData.mobile_device.general.model_display : deviceData.computer.hardware.model,
    };
		const username = deviceData[isMobile ? 'mobile_device': 'computer'].location.username
		if (deviceData.mobile_device.location.username !== '') {
			const userUrl = `${BASE_JAMF_API_URL}/users/name/${username}`;
			const userRes = await fetch(userUrl, options);
			if (userRes.status !== 200) throw Error("user not found");

			const userData = await userRes.json();

			const user = {
				username: userData.user.name,
				jamfId: userData.user.id,
				firstName: userData.user.first_name,
				middleName: userData.user.middle_name,
				lastName: userData.user.last_name,
				grade: userData.user.grade,
			}
		}

    return deviceData;
  } catch (err) {
    console.log(err);
    return err;
  }
};
