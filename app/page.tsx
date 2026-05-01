import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Zap, Shield, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#1E3A5F] flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="font-bold text-lg" style={{ color: "#1E3A5F" }}>
              ProcureLink
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/signin">
              <Button variant="outline" className="rounded-lg">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                className="rounded-lg text-white"
                style={{ backgroundColor: "#2563EB" }}
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-slate-100"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-6 mb-12">
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight" style={{ color: "#1E3A5F" }}>
              Revolutionize Your <span style={{ color: "#2563EB" }}>Procurement</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Connect buyers and suppliers in a seamless, transparent marketplace. Reduce costs, save time, and build lasting business relationships.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/signup?role=BUYER">
                <Button
                  size="lg"
                  className="w-full sm:w-auto rounded-lg text-white font-semibold"
                  style={{ backgroundColor: "#2563EB" }}
                >
                  I'm a Buyer
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/signup?role=SUPPLIER">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto rounded-lg font-semibold"
                  style={{ borderColor: "#2563EB", color: "#2563EB" }}
                >
                  I'm a Supplier
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Image Placeholder */}
          <div className="mt-16 bg-white rounded-2xl shadow-2xl p-8 border border-slate-200">
            <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🤝</span>
                </div>
                <p className="text-slate-600 font-medium">Connecting Procurement Professionals</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={{ color: "#1E3A5F" }}>
              Why Choose ProcureLink?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Trusted by thousands of businesses worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6" style={{ color: "#2563EB" }} />
              </div>
              <h3 className="text-lg font-bold mb-2 text-slate-900">Fast & Easy</h3>
              <p className="text-slate-600 text-sm">
                Post requirements or find opportunities in minutes, not weeks.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-slate-900">Cost Effective</h3>
              <p className="text-slate-600 text-sm">
                Reduce procurement costs by 30-40% through competitive bidding.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-slate-900">Secure & Verified</h3>
              <p className="text-slate-600 text-sm">
                All suppliers verified with KYC and ratings from real transactions.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-slate-900">Track & Manage</h3>
              <p className="text-slate-600 text-sm">
                Complete visibility into orders, bids, and communication history.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For Buyers Section */}
      <section className="py-20 sm:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6" style={{ color: "#1E3A5F" }}>
                For Buyers
              </h2>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 mt-0.5" style={{ color: "#2563EB" }} />
                  <div>
                    <h4 className="font-semibold text-slate-900">Post Requirements Instantly</h4>
                    <p className="text-slate-600 text-sm">Create detailed RFQs and reach qualified suppliers</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 mt-0.5" style={{ color: "#2563EB" }} />
                  <div>
                    <h4 className="font-semibold text-slate-900">Compare Multiple Quotes</h4>
                    <p className="text-slate-600 text-sm">Get competitive bids and find the best value</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 mt-0.5" style={{ color: "#2563EB" }} />
                  <div>
                    <h4 className="font-semibold text-slate-900">Verified Suppliers</h4>
                    <p className="text-slate-600 text-sm">Work only with KYC-verified and rated suppliers</p>
                  </div>
                </li>
              </ul>
              <Link href="/signup?role=BUYER">
                <Button
                  size="lg"
                  className="rounded-lg text-white font-semibold"
                  style={{ backgroundColor: "#2563EB" }}
                >
                  Get Started as Buyer
                </Button>
              </Link>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-slate-100 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center">
                <span className="text-6xl">📋</span>
                <p className="mt-4 text-slate-600 font-medium">Streamlined Procurement</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Suppliers Section */}
      <section className="py-20 sm:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="bg-gradient-to-br from-purple-50 to-slate-100 rounded-lg h-96 flex items-center justify-center order-2">
              <div className="text-center">
                <span className="text-6xl">🚀</span>
                <p className="mt-4 text-slate-600 font-medium">Grow Your Business</p>
              </div>
            </div>
            <div className="order-1">
              <h2 className="text-4xl font-bold mb-6" style={{ color: "#1E3A5F" }}>
                For Suppliers
              </h2>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 mt-0.5" style={{ color: "#2563EB" }} />
                  <div>
                    <h4 className="font-semibold text-slate-900">Find New Opportunities</h4>
                    <p className="text-slate-600 text-sm">Access thousands of procurement opportunities</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 mt-0.5" style={{ color: "#2563EB" }} />
                  <div>
                    <h4 className="font-semibold text-slate-900">Build Your Reputation</h4>
                    <p className="text-slate-600 text-sm">Earn ratings and grow your business presence</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 mt-0.5" style={{ color: "#2563EB" }} />
                  <div>
                    <h4 className="font-semibold text-slate-900">Secure Transactions</h4>
                    <p className="text-slate-600 text-sm">Work with verified buyers in a trusted marketplace</p>
                  </div>
                </li>
              </ul>
              <Link href="/signup?role=SUPPLIER">
                <Button
                  size="lg"
                  className="rounded-lg text-white font-semibold"
                  style={{ backgroundColor: "#2563EB" }}
                >
                  Get Started as Supplier
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#1E3A5F] to-[#2563EB] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Your Procurement?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of businesses already using ProcureLink to streamline their procurement process.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup?role=BUYER">
              <Button
                size="lg"
                className="w-full sm:w-auto rounded-lg font-semibold bg-white text-[#2563EB] hover:bg-slate-100"
              >
                Sign Up as Buyer
              </Button>
            </Link>
            <Link href="/signup?role=SUPPLIER">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto rounded-lg font-semibold border-white text-white hover:bg-white hover:text-[#2563EB]"
              >
                Sign Up as Supplier
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center">
                  <span className="text-white font-bold text-sm">P</span>
                </div>
                <span className="font-bold text-white">ProcureLink</span>
              </div>
              <p className="text-sm">Revolutionizing procurement for businesses worldwide.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/privacy" className="hover:text-white">Privacy</a></li>
                <li><a href="/terms" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm">
            <p>&copy; 2024 ProcureLink. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
