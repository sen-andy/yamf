import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: process.env.NEXT_PUBLIC_S3_REGION,
    credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!
    }
})

export const uploadToS3 = async (file: File) => {
    const file_key = 'uploads/' + Date.now().toString() + '-' + file.name.replace(/[^a-zA-Z0-9. ]/g, "").replace(/ /g, "_")

    const putObject = new PutObjectCommand({
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET,
        Key: file_key,
        ContentType: 'image/*',
        Body: file,
    })

    try {
        const res = await s3Client.send(putObject)
        if (res.$metadata.httpStatusCode !== 200) throw Error('s3 upload error')

        console.log('s3 status', res.$metadata.httpStatusCode);

        return Promise.resolve({
            imageUrl: getS3Url(file_key)
        })
    } catch (err) {
        console.error(err)
    }

}

export const getS3Url = (file_key:string) => {
    const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET}.s3.${process.env.NEXT_PUBLIC_S3_REGION}.amazonaws.com/${file_key}`
    return url
}