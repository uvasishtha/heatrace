"use client";

import Navigation from "@/components/Navigation";

export default function SettingsPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen p-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <p className="eyebrow">Deployment intelligence</p>
            <h1 className="mt-1 font-serif text-4xl italic text-bone">
              Settings
            </h1>
            <p className="mt-2 text-ash">
              Configure Heatrace integrations, notifications, and preferences.
            </p>
          </div>

          <div className="space-y-6">
            <section className="border border-line bg-char p-6">
              <h2 className="font-serif text-xl italic text-bone mb-4">GitHub Integration</h2>
              <p className="text-ash mb-6">Connect your GitHub organization to automatically track deployments and pull requests.</p>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-line bg-char-2 rounded">
                  <div>
                    <p className="font-medium text-bone">GitHub App Installation</p>
                    <p className="text-xs text-ash-dim mt-1">Install the Heatrace GitHub App to sync deployments and PRs</p>
                  </div>
                  <button className="px-4 py-2 text-sm font-medium bg-ember text-void border border-ember hover:bg-ember/90 transition-colors">
                    Install App
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 border border-line bg-char-2 rounded">
                  <div>
                    <p className="font-medium text-bone">Repository Access</p>
                    <p className="text-xs text-ash-dim mt-1">Configure which repositories Heatrace can access</p>
                  </div>
                  <button className="px-4 py-2 text-sm font-medium border border-line text-ash hover:text-bone hover:border-ember hover:bg-char-2 transition-colors">
                    Configure
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 border border-line bg-char-2 rounded">
                  <div>
                    <p className="font-medium text-bone">Webhook Events</p>
                    <p className="text-xs text-ash-dim mt-1">Manage which GitHub events trigger deployment tracking</p>
                  </div>
                  <button className="px-4 py-2 text-sm font-medium border border-line text-ash hover:text-bone hover:border-ember hover:bg-char-2 transition-colors">
                    Manage Events
                  </button>
                </div>
              </div>
            </section>

            <section className="border border-line bg-char p-6">
              <h2 className="font-serif text-xl italic text-bone mb-4">Datadog Integration</h2>
              <p className="text-ash mb-6">Connect Datadog to correlate deployments with production metrics and detect regressions.</p>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-line bg-char-2 rounded">
                  <div>
                    <p className="font-medium text-bone">API Key Configuration</p>
                    <p className="text-xs text-ash-dim mt-1">Add your Datadog API and App keys for metric ingestion</p>
                  </div>
                  <button className="px-4 py-2 text-sm font-medium bg-ember text-void border border-ember hover:bg-ember/90 transition-colors">
                    Add Keys
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 border border-line bg-char-2 rounded">
                  <div>
                    <p className="font-medium text-bone">Service Mapping</p>
                    <p className="text-xs text-ash-dim mt-1">Map GitHub repositories to Datadog service names</p>
                  </div>
                  <button className="px-4 py-2 text-sm font-medium border border-line text-ash hover:text-bone hover:border-ember hover:bg-char-2 transition-colors">
                    Map Services
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 border border-line bg-char-2 rounded">
                  <div>
                    <p className="font-medium text-bone">Metric Collection</p>
                    <p className="text-xs text-ash-dim mt-1">Configure which metrics to collect and at what frequency</p>
                  </div>
                  <button className="px-4 py-2 text-sm font-medium border border-line text-ash hover:text-bone hover:border-ember hover:bg-char-2 transition-colors">
                    Configure Metrics
                  </button>
                </div>
              </div>
            </section>

            <section className="border border-line bg-char p-6">
              <h2 className="font-serif text-xl italic text-bone mb-4">Regression Detection</h2>
              <p className="text-ash mb-6">Configure thresholds and rules for automatic regression detection.</p>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="p-4 border border-line bg-char-2 rounded">
                    <p className="eyebrow">Error Rate Threshold</p>
                    <div className="mt-2 flex items-center gap-3">
                      <input type="number" value="100" min="10" max="500" step="10" className="w-24 px-3 py-2 text-sm border border-line bg-char text-bone focus:outline-none focus:border-ember" />
                      <span className="text-ash-dim">% increase</span>
                    </div>
                    <p className="mt-2 text-xs text-ash-dim">Trigger regression when error rate increases by this percentage</p>
                  </div>
                  <div className="p-4 border border-line bg-char-2 rounded">
                    <p className="eyebrow">Latency Threshold</p>
                    <div className="mt-2 flex items-center gap-3">
                      <input type="number" value="50" min="10" max="200" step="10" className="w-24 px-3 py-2 text-sm border border-line bg-char text-bone focus:outline-none focus:border-ember" />
                      <span className="text-ash-dim">% increase</span>
                    </div>
                    <p className="mt-2 text-xs text-ash-dim">Trigger regression when P95 latency increases by this percentage</p>
                  </div>
                  <div className="p-4 border border-line bg-char-2 rounded">
                    <p className="eyebrow">HTTP 5xx Threshold</p>
                    <div className="mt-2 flex items-center gap-3">
                      <input type="number" value="200" min="50" max="500" step="50" className="w-24 px-3 py-2 text-sm border border-line bg-char text-bone focus:outline-none focus:border-ember" />
                      <span className="text-ash-dim">% increase</span>
                    </div>
                    <p className="mt-2 text-xs text-ash-dim">Trigger regression when 5xx errors increase by this percentage</p>
                  </div>
                  <div className="p-4 border border-line bg-char-2 rounded">
                    <p className="eyebrow">Detection Window</p>
                    <div className="mt-2 flex items-center gap-3">
                      <select className="px-3 py-2 text-sm border border-line bg-char text-bone focus:outline-none focus:border-ember">
                        <option value="5">5 minutes</option>
                        <option value="15" selected>15 minutes</option>
                        <option value="30">30 minutes</option>
                        <option value="60">1 hour</option>
                      </select>
                    </div>
                    <p className="mt-2 text-xs text-ash-dim">Time window to compare pre/post deployment metrics</p>
                  </div>
                </div>
                <button className="px-4 py-2 text-sm font-medium bg-ember text-void border border-ember hover:bg-ember/90 transition-colors">
                  Save Detection Rules
                </button>
              </div>
            </section>

            <section className="border border-line bg-char p-6">
              <h2 className="font-serif text-xl italic text-bone mb-4">Notifications</h2>
              <p className="text-ash mb-6">Configure how and where you receive regression alerts.</p>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-line bg-char-2 rounded">
                  <div>
                    <p className="font-medium text-bone">Slack Notifications</p>
                    <p className="text-xs text-ash-dim mt-1">Send regression alerts to Slack channels</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-line peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-ember/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-color-after-white peer-checked:bg-ember peer-checked:hover:bg-ember/90 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between p-4 border border-line bg-char-2 rounded">
                  <div>
                    <p className="font-medium text-bone">PagerDuty Integration</p>
                    <p className="text-xs text-ash-dim mt-1">Create incidents for critical regressions</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-line peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-ember/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-color-after-white peer-checked:bg-ember peer-checked:hover:bg-ember/90 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between p-4 border border-line bg-char-2 rounded">
                  <div>
                    <p className="font-medium text-bone">Email Digests</p>
                    <p className="text-xs text-ash-dim mt-1">Daily summary of deployments and regressions</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-line peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-ember/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-color-after-white peer-checked:bg-ember peer-checked:hover:bg-ember/90 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>
              </div>
            </section>

            <section className="border border-line bg-char p-6">
              <h2 className="font-serif text-xl italic text-bone mb-4">Team & Access</h2>
              <p className="text-ash mb-6">Manage team members and their access levels.</p>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-line bg-char-2 rounded">
                  <div>
                    <p className="font-medium text-bone">Team Members</p>
                    <p className="text-xs text-ash-dim mt-1">Invite and manage team member access</p>
                  </div>
                  <button className="px-4 py-2 text-sm font-medium border border-line text-ash hover:text-bone hover:border-ember hover:bg-char-2 transition-colors">
                    Manage Team
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 border border-line bg-char-2 rounded">
                  <div>
                    <p className="font-medium text-bone">Role-Based Access</p>
                    <p className="text-xs text-ash-dim mt-1">Configure admin, viewer, and responder roles</p>
                  </div>
                  <button className="px-4 py-2 text-sm font-medium border border-line text-ash hover:text-bone hover:border-ember hover:bg-char-2 transition-colors">
                    Configure Roles
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 border border-line bg-char-2 rounded">
                  <div>
                    <p className="font-medium text-bone">SSO Configuration</p>
                    <p className="text-xs text-ash-dim mt-1">Set up SAML/OIDC single sign-on</p>
                  </div>
                  <button className="px-4 py-2 text-sm font-medium border border-line text-ash hover:text-bone hover:border-ember hover:bg-char-2 transition-colors">
                    Configure SSO
                  </button>
                </div>
              </div>
            </section>

            <section className="border border-line bg-char p-6">
              <h2 className="font-serif text-xl italic text-bone mb-4">Appearance</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-line bg-char-2 rounded">
                  <div>
                    <p className="font-medium text-bone">Theme</p>
                    <p className="text-xs text-ash-dim mt-1">Choose your preferred color scheme</p>
                  </div>
                  <select className="px-3 py-2 text-sm border border-line bg-char text-bone focus:outline-none focus:border-ember w-40">
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                    <option value="system">System</option>
                  </select>
                </div>
                <div className="flex items-center justify-between p-4 border border-line bg-char-2 rounded">
                  <div>
                    <p className="font-medium text-bone">Compact Mode</p>
                    <p className="text-xs text-ash-dim mt-1">Reduce spacing for denser data display</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-line peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-ember/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-color-after-white peer-checked:bg-ember peer-checked:hover:bg-ember/90 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}