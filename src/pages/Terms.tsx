import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export function Terms() {
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
        Terms and Conditions for PromptDump.io
      </motion.h1>
      
      <div className="prose prose-invert max-w-none">
        <p className="text-gray-400 mb-8 text-center italic">Last Updated: 25/11/24</p>

        <div className="space-y-8">
          <section>
            <p>
              Welcome to <strong>PromptDump.io</strong> ("we," "our," or "us"). These Terms and Conditions govern your use 
              of our website and services. By accessing or using PromptDump.io, you agree to comply with these Terms. 
              If you do not agree with any part of these Terms, you must stop using our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using PromptDump.io, you acknowledge that you have read, understood, and agreed to be bound 
              by these Terms. These Terms apply to all users, including visitors, registered users, and contributors.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Use of Services</h2>
            
            <h3 className="text-xl font-semibold mb-2">a. Eligibility</h3>
            <p>
              You must be at least 18 years old to use our services. By using PromptDump.io, you represent that you are 
              legally capable of entering into a binding contract.
            </p>

            <h3 className="text-xl font-semibold mb-2">b. Prohibited Activities</h3>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Use the platform for any unlawful purposes.</li>
              <li>Submit or distribute malicious content (e.g., viruses, spam).</li>
              <li>Exploit, copy, or distribute any part of the website without prior consent.</li>
              <li>Attempt to hack, disrupt, or compromise the functionality of our platform.</li>
            </ul>

            <h3 className="text-xl font-semibold mb-2">c. Account Responsibility</h3>
            <p>
              If you create an account, you are responsible for maintaining its confidentiality and all activities 
              conducted under your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Intellectual Property</h2>
            <p>
              All content, trademarks, logos, and intellectual property displayed on PromptDump.io are owned by us or 
              our licensors. You are not allowed to copy, modify, distribute, or use our intellectual property without 
              prior written consent.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. User-Generated Content</h2>
            <p>
              Users may submit content to our platform (e.g., prompts, feedback). By submitting content, you grant us 
              a worldwide, non-exclusive, royalty-free license to use, reproduce, and modify it for our business purposes.
            </p>
            <p className="mt-4">You agree not to submit content that:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Violates any third-party rights or laws.</li>
              <li>Contains inappropriate, offensive, or harmful material.</li>
            </ul>
            <p>We reserve the right to remove user-generated content at our discretion.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Privacy and Data Collection</h2>
            <p>
              Our use of personal information is governed by our{' '}
              <Link to="/privacy" className="text-blue-400 hover:text-blue-300">
                Privacy Policy
              </Link>
              , which forms part of these Terms. By using our services, you consent to our collection and processing 
              of data as described in the Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Disclaimer of Warranties</h2>
            <p>
              PromptDump.io is provided on an "as is" and "as available" basis. We make no warranties or representations, 
              express or implied, about the website's availability, reliability, or fitness for a particular purpose.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, we are not liable for any direct, indirect, incidental, 
              consequential, or punitive damages arising out of your use or inability to use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Indemnification</h2>
            <p>
              You agree to indemnify and hold PromptDump.io, its affiliates, officers, and employees harmless from 
              any claims, damages, or legal fees arising out of your use of our services or breach of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Termination</h2>
            <p>
              We reserve the right to terminate or suspend your access to PromptDump.io without notice if you violate 
              these Terms or engage in any behavior harmful to our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Governing Law</h2>
            <p>
              These Terms are governed by the laws of California, United States. Any disputes arising from these Terms 
              will be resolved exclusively in the courts of California.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Changes to Terms</h2>
            <p>
              We reserve the right to update or modify these Terms at any time. Changes will be effective upon posting, 
              and it is your responsibility to review the Terms regularly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Contact Information</h2>
            <p>For questions about these Terms, contact us at:</p>
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
