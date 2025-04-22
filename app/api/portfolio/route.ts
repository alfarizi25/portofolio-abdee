import { NextResponse } from "next/server"
import { getPortfolioData, updatePortfolioData } from "@/lib/actions"
import type { PortfolioData } from "@/lib/types"

export async function GET() {
  const portfolioData = await getPortfolioData()
  return NextResponse.json(portfolioData)
}

export async function PUT(request: Request) {
  try {
    const data = (await request.json()) as Partial<PortfolioData>

    // Update our data using the server action
    const result = await updatePortfolioData(data)

    // Return success response
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error updating portfolio data:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update portfolio data",
      },
      { status: 500 },
    )
  }
}
