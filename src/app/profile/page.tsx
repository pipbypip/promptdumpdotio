import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { PromptCard } from '@/components/prompt-card'

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="h-20 w-20 rounded-full bg-purple-500/20 flex items-center justify-center">
            <span className="text-2xl font-bold text-purple-700">JD</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold">John Doe</h1>
            <p className="text-muted-foreground">@johndoe</p>
          </div>
        </div>
      </section>

      <Tabs defaultValue="prompts" className="space-y-4">
        <TabsList className="retro-shadow">
          <TabsTrigger value="prompts">My Prompts</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="prompts" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <PromptCard
              title="My AI Assistant Prompt"
              content="A detailed prompt for creating a helpful AI assistant..."
              author="@johndoe"
              date="2024-01-20"
              tags={['assistant', 'chatgpt', 'productivity']}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="saved">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Saved Prompts</h2>
            <p className="text-muted-foreground">Your saved prompts will appear here.</p>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Profile Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Display Name</label>
                <input
                  type="text"
                  className="w-full mt-1 px-3 py-2 bg-background border rounded-md"
                  value="John Doe"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Bio</label>
                <textarea
                  className="w-full mt-1 px-3 py-2 bg-background border rounded-md"
                  rows={3}
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
