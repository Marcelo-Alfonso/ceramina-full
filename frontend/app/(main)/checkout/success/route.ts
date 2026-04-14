import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const token = url.searchParams.get("token")

  return NextResponse.redirect(
    `${url.origin}/checkout/success/view?token=${token}`,
    303
  )
}

export async function POST(request: Request) {
  const formData = await request.formData()
  const token = formData.get("token")

  const url = new URL(request.url)

  return NextResponse.redirect(
    `${url.origin}/checkout/success/view?token=${token}`,
    303
  )
}