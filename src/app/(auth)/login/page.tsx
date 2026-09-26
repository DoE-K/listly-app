'use client'

import { useActionState } from 'react'
import { login } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, null)

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Willkommen zurück</CardTitle>
          <CardDescription>
            Logg dich ein, um deine Listen zu verwalten.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="flex flex-col gap-4">
            {state?.error && (
              <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {state.error}
              </p>
            )}

            <div className="grid gap-2">
              <Label htmlFor="email">E-Mail</Label>
              <Input id="email" name="email" type="email" placeholder="du@beispiel.de" />
              {state?.fieldErrors?.email && (
                <p className="text-sm text-destructive">
                  {state.fieldErrors.email[0]}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Passwort</Label>
              <Input id="password" name="password" type="password" />
              {state?.fieldErrors?.password && (
                <p className="text-sm text-destructive">
                  {state.fieldErrors.password[0]}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? 'Wird eingeloggt...' : 'Login'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}