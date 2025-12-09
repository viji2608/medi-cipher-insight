import React, { useState } from 'react';
import { Settings, Bell, Shield, Moon, Sun, Volume2, VolumeX, Eye, EyeOff } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface SettingsDialogProps {
  trigger?: React.ReactNode;
}

export function SettingsDialog({ trigger }: SettingsDialogProps) {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState({
    darkMode: true,
    notifications: true,
    soundEffects: false,
    showEncryptionBadge: true,
    autoScroll: true,
    compactMode: false,
    responseStyle: 'detailed',
    encryptionLevel: 'aes-256',
  });

  const updateSetting = (key: keyof typeof settings, value: boolean | string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    toast.success('Setting updated', {
      description: `${key.replace(/([A-Z])/g, ' $1').toLowerCase()} has been ${typeof value === 'boolean' ? (value ? 'enabled' : 'disabled') : `set to ${value}`}`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="flex-1 gap-1.5">
            <Settings className="w-4 h-4" />
            Settings
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            Settings
          </DialogTitle>
          <DialogDescription>
            Configure your MediVaultAI experience
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Appearance Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
              {settings.darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              Appearance
            </h4>
            <div className="space-y-3 pl-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="dark-mode" className="text-sm text-muted-foreground">
                  Dark Mode
                </Label>
                <Switch
                  id="dark-mode"
                  checked={settings.darkMode}
                  onCheckedChange={(v) => updateSetting('darkMode', v)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="compact-mode" className="text-sm text-muted-foreground">
                  Compact Mode
                </Label>
                <Switch
                  id="compact-mode"
                  checked={settings.compactMode}
                  onCheckedChange={(v) => updateSetting('compactMode', v)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Notifications Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </h4>
            <div className="space-y-3 pl-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications" className="text-sm text-muted-foreground">
                  Enable Notifications
                </Label>
                <Switch
                  id="notifications"
                  checked={settings.notifications}
                  onCheckedChange={(v) => updateSetting('notifications', v)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="sound-effects" className="text-sm text-muted-foreground flex items-center gap-2">
                  {settings.soundEffects ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
                  Sound Effects
                </Label>
                <Switch
                  id="sound-effects"
                  checked={settings.soundEffects}
                  onCheckedChange={(v) => updateSetting('soundEffects', v)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Security Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Security & Privacy
            </h4>
            <div className="space-y-3 pl-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="encryption-badge" className="text-sm text-muted-foreground flex items-center gap-2">
                  {settings.showEncryptionBadge ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  Show Encryption Badge
                </Label>
                <Switch
                  id="encryption-badge"
                  checked={settings.showEncryptionBadge}
                  onCheckedChange={(v) => updateSetting('showEncryptionBadge', v)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="encryption-level" className="text-sm text-muted-foreground">
                  Encryption Level
                </Label>
                <Select
                  value={settings.encryptionLevel}
                  onValueChange={(v) => updateSetting('encryptionLevel', v)}
                >
                  <SelectTrigger className="w-32 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aes-128">AES-128</SelectItem>
                    <SelectItem value="aes-256">AES-256</SelectItem>
                    <SelectItem value="aes-512">AES-512</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Response Settings */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground">Response Style</h4>
            <div className="space-y-3 pl-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-scroll" className="text-sm text-muted-foreground">
                  Auto-scroll to new messages
                </Label>
                <Switch
                  id="auto-scroll"
                  checked={settings.autoScroll}
                  onCheckedChange={(v) => updateSetting('autoScroll', v)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="response-style" className="text-sm text-muted-foreground">
                  Response Detail Level
                </Label>
                <Select
                  value={settings.responseStyle}
                  onValueChange={(v) => updateSetting('responseStyle', v)}
                >
                  <SelectTrigger className="w-32 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="concise">Concise</SelectItem>
                    <SelectItem value="detailed">Detailed</SelectItem>
                    <SelectItem value="comprehensive">Comprehensive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
