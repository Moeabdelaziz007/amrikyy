"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SettingsPage;
const react_1 = require("react");
const react_query_1 = require("@tanstack/react-query");
const sidebar_1 = require("@/components/layout/sidebar");
const header_1 = require("@/components/layout/header");
const card_1 = require("@/components/ui/card");
const input_1 = require("@/components/ui/input");
const button_1 = require("@/components/ui/button");
const select_1 = require("@/components/ui/select");
const switch_1 = require("@/components/ui/switch");
const toaster_1 = require("@/components/ui/toaster");
const automation_api_1 = require("@/services/automation-api");

function SettingsPage() {
    const [name, setName] = (0, react_1.useState)("");
    const [email, setEmail] = (0, react_1.useState)("");
    const [avatar, setAvatar] = (0, react_1.useState)("");
    const [theme, setTheme] = (0, react_1.useState)("auto");
    const [language, setLanguage] = (0, react_1.useState)("en");
    const [notifications, setNotifications] = (0, react_1.useState)(true);
    const [reducedMotion, setReducedMotion] = (0, react_1.useState)(false);

    const queryClient = (0, react_query_1.useQueryClient)();

    const { data: me, isLoading: loadingMe } = (0, react_query_1.useQuery)({
        queryKey: ['me'],
        queryFn: () => automation_api_1.automationApi.getMe().then(r => r.data),
        onSuccess: (data) => {
            setName(data?.name || "");
            setEmail(data?.email || "");
            setAvatar(data?.avatar || "");
            const prefs = data?.preferences || {};
            setTheme(prefs.theme || 'auto');
            setLanguage(prefs.language || 'en');
            setNotifications(prefs.notifications ?? true);
            setReducedMotion(prefs.reducedMotion ?? false);
        }
    });

    const updateProfile = (0, react_query_1.useMutation)({
        mutationFn: (payload) => automation_api_1.automationApi.updateMe(payload).then(r => r.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['me'] });
            toaster_1.toast({ title: 'Profile updated' });
        },
        onError: (e) => toaster_1.toast({ variant: 'destructive', title: 'Update failed', description: e.message })
    });

    const updatePrefs = (0, react_query_1.useMutation)({
        mutationFn: (payload) => automation_api_1.automationApi.updateMyPreferences(payload).then(r => r.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['me'] });
            toaster_1.toast({ title: 'Preferences saved' });
        },
        onError: (e) => toaster_1.toast({ variant: 'destructive', title: 'Save failed', description: e.message })
    });

    return (<div className="flex h-screen overflow-hidden bg-background carbon-texture">
      <sidebar_1.default />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header_1.default title="Settings" subtitle="Manage your preferences and configuration"/>
        <main className="flex-1 overflow-auto cyber-scrollbar">
          <div className="p-6 max-w-4xl mx-auto space-y-6">
            <card_1.Card className="glass-card">
              <card_1.CardHeader>
                <card_1.CardTitle>Profile</card_1.CardTitle>
                <card_1.CardDescription>Update your display information</card_1.CardDescription>
              </card_1.CardHeader>
              <card_1.CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Display Name</label>
                  <input_1.Input placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)}/>
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <input_1.Input type="email" placeholder="you@example.com" value={email} disabled/>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium">Avatar URL</label>
                  <input_1.Input placeholder="https://..." value={avatar} onChange={(e) => setAvatar(e.target.value)}/>
                </div>
                <div className="md:col-span-2 text-right">
                  <button_1.Button disabled={updateProfile.isLoading} onClick={() => updateProfile.mutate({ name, avatar })}>{updateProfile.isLoading ? 'Saving...' : 'Save Profile'}</button_1.Button>
                </div>
              </card_1.CardContent>
            </card_1.Card>

            <card_1.Card className="glass-card">
              <card_1.CardHeader>
                <card_1.CardTitle>Preferences</card_1.CardTitle>
                <card_1.CardDescription>Personalize your experience</card_1.CardDescription>
              </card_1.CardHeader>
              <card_1.CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div>
                  <label className="text-sm font-medium">Theme</label>
                  <select_1.Select value={theme} onValueChange={setTheme}>
                    <select_1.SelectTrigger>
                      <select_1.SelectValue />
                    </select_1.SelectTrigger>
                    <select_1.SelectContent>
                      <select_1.SelectItem value="auto">Auto</select_1.SelectItem>
                      <select_1.SelectItem value="light">Light</select_1.SelectItem>
                      <select_1.SelectItem value="dark">Dark</select_1.SelectItem>
                    </select_1.SelectContent>
                  </select_1.Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Language</label>
                  <select_1.Select value={language} onValueChange={setLanguage}>
                    <select_1.SelectTrigger>
                      <select_1.SelectValue />
                    </select_1.SelectTrigger>
                    <select_1.SelectContent>
                      <select_1.SelectItem value="en">English</select_1.SelectItem>
                      <select_1.SelectItem value="ar">العربية</select_1.SelectItem>
                    </select_1.SelectContent>
                  </select_1.Select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Enable Notifications</p>
                    <p className="text-xs text-muted-foreground">Receive system alerts and updates</p>
                  </div>
                  <switch_1.Switch checked={notifications} onCheckedChange={setNotifications}/>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Reduced Motion</p>
                    <p className="text-xs text-muted-foreground">Minimize animations for accessibility</p>
                  </div>
                  <switch_1.Switch checked={reducedMotion} onCheckedChange={setReducedMotion}/>
                </div>
                <div className="md:col-span-2 text-right">
                  <button_1.Button disabled={updatePrefs.isLoading} onClick={() => updatePrefs.mutate({ theme, notifications, language, reducedMotion })}>{updatePrefs.isLoading ? 'Saving...' : 'Save Preferences'}</button_1.Button>
                </div>
              </card_1.CardContent>
            </card_1.Card>
          </div>
        </main>
      </div>
    </div>);
}


