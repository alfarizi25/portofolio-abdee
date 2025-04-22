import { NextResponse } from "next/server"
import { getPortfolioData } from "@/lib/actions"
import type { MessageItem } from "@/lib/types"

export async function GET() {
  const portfolioData = await getPortfolioData()
  return NextResponse.json(portfolioData.messages || [])
}

export async function POST(request: Request) {
  try {
    const data = (await request.json()) as MessageItem

    // In a real app, you would save this to a database
    // For now, we'll just return success

    return NextResponse.json({
      success: true,
      message: "Contact message saved successfully",
    })
  } catch (error) {
    console.error("Error saving contact message:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to save contact message",
      },
      { status: 500 },
    )
  }
}
