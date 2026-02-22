'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Button from '@/components/ui/Button'

const steps = [
  {
    num: '01',
    title: 'Share Your Space',
    description: 'Upload photos and tell us about your outdoor area.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Choose Your Style',
    description: 'Select images that inspire you across 10 design categories.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Get Your Designs',
    description: 'Receive bespoke landscape concepts tailored to your home.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
      </svg>
    ),
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero */}
      <main className="flex-1">
        <section className="relative min-h-[85vh] flex items-center">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=85"
              alt="Luxury landscape garden"
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-bg/95 via-bg/80 to-bg/40" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl"
            >
              <span className="inline-block text-xs tracking-brand-wide text-brand-green uppercase mb-6">
                Effekt Design — Dubai
              </span>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-text-dark leading-tight mb-6">
                Design Your Dream{' '}
                <em className="text-brand-green">Outdoor Space</em>
              </h1>

              <p className="text-base sm:text-lg text-text-medium leading-relaxed mb-8 max-w-xl">
                Answer a few questions and we&apos;ll create personalised landscape concepts
                for your home — designed for Dubai&apos;s unique climate and lifestyle.
              </p>

              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Link href="/design/upload">
                  <Button size="lg" className="text-base">
                    Start Your Design Journey
                    <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Button>
                </Link>
                <p className="text-xs text-text-muted sm:pt-3">
                  Free · Takes 5 minutes · No commitment
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 sm:py-28 bg-bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <span className="text-xs tracking-brand-wide text-text-muted uppercase">
                How It Works
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-text-dark mt-3">
                Three steps to your <em className="text-brand-green">perfect garden</em>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12">
              {steps.map((step, i) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-sage-100 text-brand-green mb-5">
                    {step.icon}
                  </div>
                  <span className="block text-xs tracking-brand-wide text-text-muted uppercase mb-2">
                    {step.num}
                  </span>
                  <h3 className="font-serif text-xl text-text-dark mb-2">{step.title}</h3>
                  <p className="text-sm text-text-medium leading-relaxed max-w-xs mx-auto">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 sm:py-28 bg-sage-100">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-serif text-3xl sm:text-4xl text-text-dark mb-4">
                Ready to transform your <em className="text-brand-green">outdoor space</em>?
              </h2>
              <p className="text-text-medium mb-8 max-w-lg mx-auto">
                Our AI-powered design tool creates personalised concepts based on your
                space, style, and Dubai&apos;s unique climate.
              </p>
              <Link href="/design/upload">
                <Button size="lg">
                  Begin Now — It&apos;s Free
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
