import { SEO } from "@/components/SEO"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function Settings() {
  const { theme, setTheme } = useTheme()

  return (
    <>
      <SEO 
        title="Settings - WellBeingConnect"
        description="Customize your WellBeingConnect experience with theme preferences and settings."
      />
      
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
          {/* Appearance Settings */}
          <Card className="bg-gradient-card border-0 shadow-md">
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize the appearance of the application to your preference.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Theme</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme("light")}
                    className={`flex items-center gap-2 ${theme === "light" ? "bg-gradient-primary" : "hover:bg-gradient-accent"}`}
                  >
                    <Sun className="h-4 w-4" />
                    Light
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme("dark")}
                    className={`flex items-center gap-2 ${theme === "dark" ? "bg-gradient-primary" : "hover:bg-gradient-accent"}`}
                  >
                    <Moon className="h-4 w-4" />
                    Dark
                  </Button>
                </div>
              </div>
              
              <Separator />
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card className="bg-gradient-card border-0 shadow-md">
            <CardHeader>
              <CardTitle>Privacy & Data</CardTitle>
              <CardDescription>
                Manage your privacy preferences and data settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="analytics" className="text-sm font-medium">
                    Analytics
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Help improve the app by sharing anonymous usage data
                  </p>
                </div>
                <Switch id="analytics" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications" className="text-sm font-medium">
                    Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive reminders and updates
                  </p>
                </div>
                <Switch id="notifications" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
