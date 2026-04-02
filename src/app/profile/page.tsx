"use client"

import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { UserCircle, Save } from "lucide-react"
import { toast } from "sonner"

const timezones = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Phoenix",
  "Pacific/Honolulu",
]

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")

  const [state, setState] = useState("")
  const [phone, setPhone] = useState("")
  const [emergencyName, setEmergencyName] = useState("")
  const [emergencyPhone, setEmergencyPhone] = useState("")
  const [emergencyRelation, setEmergencyRelation] = useState("")
  const [startDate, setStartDate] = useState("")
  const [birthday, setBirthday] = useState("")
  const [pronouns, setPronouns] = useState("")
  const [timezone, setTimezone] = useState("")

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        setUserName(data.user?.name ?? "")
        setUserEmail(data.user?.email ?? "")
        if (data.profile) {
          setState(data.profile.state ?? "")
          setPhone(data.profile.phone ?? "")
          setEmergencyName(data.profile.emergencyName ?? "")
          setEmergencyPhone(data.profile.emergencyPhone ?? "")
          setEmergencyRelation(data.profile.emergencyRelation ?? "")
          setStartDate(data.profile.startDate ?? "")
          setBirthday(data.profile.birthday ?? "")
          setPronouns(data.profile.pronouns ?? "")
          setTimezone(data.profile.timezone ?? "")
        }
      })
      .catch(() => toast.error("Failed to load profile"))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          state,
          phone,
          emergencyName,
          emergencyPhone,
          emergencyRelation,
          startDate,
          birthday,
          pronouns,
          timezone,
        }),
      })
      if (!res.ok) throw new Error()
      toast.success("Profile saved")
    } catch {
      toast.error("Failed to save profile")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl py-8 text-sm text-muted-foreground">
        Loading...
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground">
          View and update your personal information.
        </p>
      </div>

      {/* Read-only info */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <UserCircle className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Account Info</CardTitle>
          </div>
          <CardDescription>
            Name and email come from your Google account and cannot be changed here.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={userName} disabled />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={userEmail} disabled />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Editable fields */}
      <form onSubmit={handleSave}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Personal Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Pronouns</Label>
                <Input
                  value={pronouns}
                  onChange={(e) => setPronouns(e.target.value)}
                  placeholder="e.g. he/him, she/her, they/them"
                />
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <Input
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. Florida"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </div>
              <div className="space-y-2">
                <Label>Timezone</Label>
                <Select value={timezone} onValueChange={(v) => setTimezone(v ?? "")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map((tz) => (
                      <SelectItem key={tz} value={tz}>
                        {tz.replace("America/", "").replace("Pacific/", "").replace(/_/g, " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder="e.g. March 2024"
                />
              </div>
              <div className="space-y-2">
                <Label>Birthday (month/day)</Label>
                <Input
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  placeholder="e.g. 03/15"
                />
              </div>
            </div>

            <Separator />

            <p className="text-sm font-medium">Emergency Contact</p>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  placeholder="Contact name"
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </div>
              <div className="space-y-2">
                <Label>Relationship</Label>
                <Input
                  value={emergencyRelation}
                  onChange={(e) => setEmergencyRelation(e.target.value)}
                  placeholder="e.g. Spouse, Parent"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" disabled={saving}>
                <Save className="mr-1 h-4 w-4" />
                {saving ? "Saving..." : "Save Profile"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
