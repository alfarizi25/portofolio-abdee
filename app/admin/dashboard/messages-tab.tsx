"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, Mail, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Message } from "@/lib/db"

interface MessagesTabProps {
  onStatsUpdate: () => void
}

export function MessagesTab({ onStatsUpdate }: MessagesTabProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const response = await fetch("/api/messages")
      const data = await response.json()
      setMessages(data)
    } catch (error) {
      console.error("Error fetching messages:", error)
      toast({
        title: "Error",
        description: "Failed to fetch messages.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const deleteMessage = async (id: string) => {
    try {
      const response = await fetch(`/api/messages/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setMessages((prev) => prev.filter((msg) => msg.id !== id))
        onStatsUpdate()
        toast({
          title: "Message deleted",
          description: "The message has been successfully deleted.",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete message.",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-300 rounded w-1/4 mb-2" />
              <div className="h-3 bg-gray-300 rounded w-1/3" />
            </CardHeader>
            <CardContent>
              <div className="h-3 bg-gray-300 rounded mb-2" />
              <div className="h-3 bg-gray-300 rounded w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {messages.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Mail className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 text-center">No messages yet</p>
          </CardContent>
        </Card>
      ) : (
        messages.map((message) => (
          <Card key={message.id} className="bg-white/5 border-white/10">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{message.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Mail className="h-4 w-4" />
                    {message.email}
                    <Badge variant="outline" className="ml-2">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(message.created_at)}
                    </Badge>
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteMessage(message.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{message.message}</p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
