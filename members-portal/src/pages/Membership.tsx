import { useAuth } from '../hooks/useAuth'
import { Layout } from '../components/Layout'

export function Membership() {
  const { profile } = useAuth()

  const plans = [
    {
      name: 'Monthly',
      price: '$97',
      period: '/month',
      priceId: import.meta.env.VITE_STRIPE_MONTHLY_PRICE_ID,
      features: [
        'Unlimited access to all content',
        'Progress tracking across all devices',
        'Notes and favorites',
        'Community access',
        'Weekly live training sessions',
        'Downloadable resources',
        'Priority email support',
      ],
      current: profile?.membership_tier === 'monthly',
    },
    {
      name: 'Annual',
      price: '$970',
      period: '/year',
      savings: 'Save $194 (17% off)',
      priceId: import.meta.env.VITE_STRIPE_ANNUAL_PRICE_ID,
      features: [
        'Everything in Monthly',
        '17% savings ($97/month → $80.83/month)',
        'Exclusive annual member perks',
        'Priority access to new content',
        'VIP community badge',
        'Annual strategy session',
      ],
      current: profile?.membership_tier === 'annual',
      recommended: true,
    },
  ]

  const handleUpgrade = (priceId: string) => {
    // In production, this would redirect to Stripe Checkout
    const checkoutUrl = `${import.meta.env.VITE_MAIN_SITE_URL}/checkout?price=${priceId}&email=${profile?.email}`
    window.location.href = checkoutUrl
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">Membership</h1>
          <p className="mt-4 text-xl text-gray-600">
            Choose the plan that works best for you
          </p>
        </div>

        {/* Current Status */}
        {profile && (
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Current Plan</h2>
                <p className="mt-1 text-gray-600 capitalize">
                  {profile.membership_tier} - {profile.membership_status}
                </p>
                {profile.membership_tier === 'trial' && profile.trial_end_date && (
                  <p className="mt-2 text-sm text-yellow-700">
                    Trial ends {new Date(profile.trial_end_date).toLocaleDateString()}
                  </p>
                )}
              </div>
              {profile.stripe_customer_id && (
                <a
                  href={`https://billing.stripe.com/p/login/test_...`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                >
                  Manage Billing
                </a>
              )}
            </div>
          </div>
        )}

        {/* Pricing Plans */}
        <div className="grid md:grid-cols-2 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`card overflow-hidden ${
                plan.recommended ? 'ring-2 ring-primary-600' : ''
              }`}
            >
              {plan.recommended && (
                <div className="bg-primary-600 text-white text-center py-2 text-sm font-semibold">
                  RECOMMENDED
                </div>
              )}

              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600">{plan.period}</span>
                </div>
                {plan.savings && (
                  <p className="mt-2 text-sm font-medium text-green-600">{plan.savings}</p>
                )}

                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleUpgrade(plan.priceId)}
                  disabled={plan.current}
                  className={`mt-8 w-full ${
                    plan.current
                      ? 'btn btn-secondary cursor-not-allowed'
                      : plan.recommended
                      ? 'btn btn-primary'
                      : 'btn btn-outline'
                  }`}
                >
                  {plan.current ? 'Current Plan' : 'Upgrade Now'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="card p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-600">
                Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">
                We accept all major credit cards, debit cards, and digital wallets through our secure payment processor, Stripe.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Is there a refund policy?</h3>
              <p className="text-gray-600">
                We offer a 30-day money-back guarantee. If you're not satisfied with your membership, contact us within 30 days for a full refund.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
