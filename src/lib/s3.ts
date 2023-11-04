import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: process.env.NEXT_PUBLIC_S3_REGION
})

export const uploadToS3 = async (file: File) => {
    const file_key = 'uploads/' + Date.now().toString() + file.name.replace(/[^a-zA-Z. ]/g, "").replace(/ /g, "_")

    const putObject = new PutObjectCommand({
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET,
        Key: file_key,
        Body: file
    })
    try {
        const res = await s3Client.send(putObject)
        if (res.$metadata.httpStatusCode !== 200) throw Error('s3 upload error')

        return Promise.resolve({
            file_key,
            file_name: file.name
        })
    } catch (err) {
        console.error(err)
    }

}

export const getS3Url = (file_key:string) => {
    const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET}.${process.env.NEXT_PUBLIC_S3_REGION}.amazonaws.com/${file_key}`
    return url
}