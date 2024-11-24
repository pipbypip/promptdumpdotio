import React from 'react';
import { motion } from 'framer-motion';

export function Privacy() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8 max-w-4xl"
    >
      <motion.h1 
        className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent"
      >
        Privacy Policy for PromptDump.io
      </motion.h1>
      
      <div className="prose prose-invert max-w-none">
        <p className="text-gray-400 mb-8 text-center italic">Last Updated: 25/11/24</p>

        <div className="space-y-8">
          <section>
            <p>
              Welcome to <strong>PromptDump.io</strong> ("we," "our," or "us"). Protecting your personal information is of utmost importance to us. 
              This Privacy Policy explains how we collect, use, and protect your information when you interact with our services. 
              By using PromptDump.io, you agree to the practices described in this policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold mb-2">a. Personal Information</h3>
            <p>We collect the following types of personal information when you use our services:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Name</li>
              <li>Email address</li>
              <li>IP address</li>
              <li>Usage data (e.g., interaction logs, preferences, and browsing habits)</li>
            </ul>

            <h3 className="text-xl font-semibold mb-2">b. Sensitive Information</h3>
            <p>
              We do not process sensitive personal data (e.g., health data, racial or ethnic origin) 
              unless explicitly required and consented to by you.
            </p>

            <h3 className="text-xl font-semibold mb-2">c. Automatically Collected Data</h3>
            <p>We automatically collect technical information, including:</p>
            <ul className="list-disc pl-6">
              <li>Browser type and version</li>
              <li>Device information (model, operating system)</li>
              <li>Geolocation data</li>
              <li>Cookie identifiers and analytics data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
            <p>We use the collected data to:</p>
            <ul className="list-disc pl-6">
              <li>Provide and maintain our services</li>
              <li>Improve user experience and site functionality</li>
              <li>Send transactional and promotional communications</li>
              <li>Analyze trends and optimize our services</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Legal Basis for Processing Your Data (For EU/EEA Residents)</h2>
            <p>We process your data based on:</p>
            <ul className="list-disc pl-6">
              <li>Your consent</li>
              <li>Performance of a contract</li>
              <li>Legal obligations</li>
              <li>Legitimate interests (e.g., improving and securing our platform)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Sharing Your Information</h2>
            <p>We may share your data with:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Third-party service providers (e.g., hosting services, analytics platforms)</li>
              <li>Legal authorities if required by law</li>
              <li>Advertising and marketing partners (with your consent)</li>
            </ul>
            <p>
              Our third-party partners are contractually obligated to protect your information 
              in compliance with GDPR and other applicable regulations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Data Retention</h2>
            <p>
              We retain personal data as long as necessary to fulfill the purposes outlined in this policy 
              or as required by law. Once no longer needed, we securely delete or anonymize your data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Cookies and Tracking Technologies</h2>
            <p>We use cookies and similar technologies to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Enhance site performance</li>
              <li>Deliver targeted advertisements</li>
              <li>Collect analytics data</li>
            </ul>
            <p>
              You can manage your cookie preferences via your browser settings or our cookie management tool.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Your Rights (For EU/EEA Residents)</h2>
            <p>Under GDPR, you have the following rights:</p>
            <ul className="list-disc pl-6">
              <li><strong>Access</strong>: Request a copy of your data.</li>
              <li><strong>Correction</strong>: Update inaccurate data.</li>
              <li><strong>Deletion</strong>: Request erasure of your data.</li>
              <li><strong>Restriction</strong>: Limit the processing of your data.</li>
              <li><strong>Data Portability</strong>: Receive your data in a machine-readable format.</li>
              <li><strong>Objection</strong>: Object to data processing based on legitimate interests.</li>
              <li><strong>Withdraw Consent</strong>: Withdraw your consent at any time.</li>
            </ul>
            <p className="mt-4">
              To exercise these rights, contact us at <a href="mailto:support@promptdump.io" className="text-blue-400 hover:text-blue-300">support@promptdump.io</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Security Measures</h2>
            <p>
              We implement robust security measures to protect your data from unauthorized access or disclosure. 
              However, no system is 100% secure. You share data at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Third-Party Links</h2>
            <p>
              Our site may contain links to third-party websites. We are not responsible for their privacy practices. 
              Please review their policies independently.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Updates to This Privacy Policy</h2>
            <p>
              We may update this policy occasionally. Updates will be reflected by the "Last Updated" date at the top. 
              Significant changes may be communicated via email or site notifications.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Contact Information</h2>
            <p>For questions or concerns about this Privacy Policy, contact us at:</p>
            <p className="mt-2">
              <strong>PromptDump.io</strong><br />
              Email: <a href="mailto:promptdump@gmail.com" className="text-blue-400 hover:text-blue-300">promptdump@gmail.com</a>
            </p>
          </section>
        </div>
      </div>
    </motion.div>
  );
}
