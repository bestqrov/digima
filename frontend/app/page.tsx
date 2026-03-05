'use client';

import { useRouter } from 'next/navigation';
import {
  TruckIcon,
  MapPinIcon,
  UsersIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  BoltIcon,
  CheckCircleIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

const features = [
  {
    icon: TruckIcon,
    title: 'Fleet Management',
    description: 'Track and manage your entire vehicle fleet in real-time. Monitor status, maintenance schedules, and availability at a glance.',
    color: 'bg-blue-500',
  },
  {
    icon: MapPinIcon,
    title: 'Trip Tracking',
    description: 'Plan, assign, and monitor tourist trips from start to finish. Get live updates and full route history for every journey.',
    color: 'bg-indigo-500',
  },
  {
    icon: UsersIcon,
    title: 'Team Management',
    description: 'Manage drivers, guides, and agency staff with role-based access control. Keep everyone aligned and productive.',
    color: 'bg-purple-500',
  },
  {
    icon: ChartBarIcon,
    title: 'Analytics & Reports',
    description: 'Make data-driven decisions with rich dashboards showing revenue, utilization rates, and booking trends.',
    color: 'bg-green-500',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Multi-Tenant Security',
    description: 'Each agency gets a fully isolated workspace. Enterprise-grade security and compliance built in from day one.',
    color: 'bg-orange-500',
  },
  {
    icon: BoltIcon,
    title: 'Fast & Reliable',
    description: 'Built on a modern NestJS + Next.js stack with 99.9% uptime SLA. Scale from startup to enterprise without friction.',
    color: 'bg-pink-500',
  },
];

const stats = [
  { label: 'Active Agencies', value: '50+' },
  { label: 'Trips Managed', value: '10k+' },
  { label: 'Vehicles Tracked', value: '500+' },
  { label: 'Uptime', value: '99.9%' },
];

const plans = [
  {
    name: 'Starter',
    price: '$49',
    description: 'Perfect for small agencies just getting started.',
    features: ['Up to 10 vehicles', '2 user accounts', 'Basic analytics', 'Email support'],
    cta: 'Get started',
    highlighted: false,
  },
  {
    name: 'Professional',
    price: '$149',
    description: 'Everything you need to grow your agency.',
    features: ['Up to 50 vehicles', '10 user accounts', 'Advanced analytics', 'Priority support', 'API access'],
    cta: 'Start free trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'Tailored solutions for large operations.',
    features: ['Unlimited vehicles', 'Unlimited users', 'Custom reports', 'Dedicated support', 'SLA guarantee'],
    cta: 'Contact sales',
    highlighted: false,
  },
];

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">
      {/* ── Navbar ── */}
      <header className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow">
              <TruckIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">ArwaPark</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#features" className="hover:text-gray-900 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-gray-900 transition-colors">Pricing</a>
            <a
              href="https://arwapark.digima.cloud/api/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-900 transition-colors"
            >
              API Docs
            </a>
          </nav>

          <button
            onClick={() => router.push('/login')}
            className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            Sign In
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <CheckCircleIcon className="w-4 h-4" />
            Multi-Tenant SaaS · Now Live
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
            The smarter way to run your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              transport agency
            </span>
          </h1>
          <p className="mt-6 text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            ArwaPark is the all-in-one SaaS platform for tourist transport agencies. Manage fleets, trips, drivers, and revenue — all from one powerful dashboard.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => router.push('/login')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 text-white text-base font-semibold px-8 py-3.5 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
            >
              Get started free
              <ArrowRightIcon className="w-5 h-5" />
            </button>
            <a
              href="https://arwapark.digima.cloud/api/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-gray-700 text-base font-semibold px-8 py-3.5 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
            >
              View API Docs
            </a>
          </div>
        </div>

        {/* Hero visual */}
        <div className="mt-16 max-w-5xl mx-auto rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 h-72 flex items-center justify-center shadow-2xl shadow-blue-200">
          <div className="text-center text-white px-8">
            <TruckIcon className="w-16 h-16 mx-auto mb-4 opacity-80" />
            <p className="text-2xl font-bold">Live Dashboard Preview</p>
            <p className="mt-2 text-blue-200 text-sm">Real-time fleet &amp; trip management</p>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16 border-y border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-4xl font-extrabold text-blue-600">{s.value}</p>
              <p className="mt-1 text-sm font-medium text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900">Everything your agency needs</h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
              From a single vehicle to a multi-city fleet, ArwaPark scales with you.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 ${f.color} rounded-xl flex items-center justify-center mb-5`}>
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900">Simple, transparent pricing</h2>
            <p className="mt-4 text-lg text-gray-500">Start free. Upgrade when you grow.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-8 flex flex-col ${
                  plan.highlighted
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-2xl shadow-blue-200 scale-105'
                    : 'bg-gray-50 border border-gray-200'
                }`}
              >
                <h3 className={`text-xl font-bold ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
                <p className={`mt-1 text-sm ${plan.highlighted ? 'text-blue-100' : 'text-gray-500'}`}>{plan.description}</p>
                <div className="mt-6">
                  <span className={`text-4xl font-extrabold ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>{plan.price}</span>
                  {plan.price !== 'Custom' && (
                    <span className={`text-sm ml-1 ${plan.highlighted ? 'text-blue-100' : 'text-gray-500'}`}>/month</span>
                  )}
                </div>
                <ul className="mt-6 space-y-3 flex-1">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2 text-sm">
                      <CheckCircleIcon className={`w-4 h-4 flex-shrink-0 ${plan.highlighted ? 'text-blue-200' : 'text-green-500'}`} />
                      <span className={plan.highlighted ? 'text-blue-50' : 'text-gray-700'}>{feat}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => router.push('/login')}
                  className={`mt-8 w-full py-3 rounded-xl text-sm font-semibold transition-colors ${
                    plan.highlighted
                      ? 'bg-white text-blue-600 hover:bg-blue-50'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-4xl font-extrabold">Ready to transform your agency?</h2>
          <p className="mt-4 text-blue-100 text-lg">
            Join 50+ agencies already using ArwaPark to streamline their operations.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="mt-8 inline-flex items-center gap-2 bg-white text-blue-600 font-bold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
          >
            Start for free today
            <ArrowRightIcon className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-10 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <TruckIcon className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold">ArwaPark</span>
          </div>
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} ArwaPark · Powered by{' '}
            <a href="https://digima.cloud" className="text-blue-400 hover:text-blue-300 transition-colors">
              Digima Cloud
            </a>
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <a
              href="https://arwapark.digima.cloud/api/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              API Docs
            </a>
            <button onClick={() => router.push('/login')} className="hover:text-white transition-colors">
              Sign In
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}