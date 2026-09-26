import { ThemeToggle } from '@/components/theme-toggle'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold tracking-tight">Einstellungen</h1>

      <Card>
        <CardHeader>
          <CardTitle>Erscheinungsbild</CardTitle>
          <CardDescription>
            Wähle zwischen hellem und dunklem Design.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ThemeToggle />
        </CardContent>
      </Card>
    </div>
  )
}