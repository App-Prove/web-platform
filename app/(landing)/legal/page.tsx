import Link from 'next/link';

export default function LegalPage() {
    return (
        <div className='max-w-5xl mx-auto py-8 px-4'>
            <h1 className="text-3xl font-bold mb-6">Legal Information</h1>
            <p className="mb-6">
                This page outlines the terms and conditions, privacy policy, and other legal aspects of using App-Prove&apos;s services. Please read these terms carefully before engaging our services.
            </p>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Terms of Service</h2>

                <h3 className="text-xl font-medium mt-4 mb-2">1. Services Provided</h3>
                <p>
                    App-Prove offers cyber-security audit services, ensuring code safety in terms of bugs and security. We provide a proof of audit with detailed checkpoints, verifying standards for logical security, change safety, and infrastructure security.
                </p>

                <h3 className="text-xl font-medium mt-4 mb-2">2. Engagement Process</h3>
                <p>
                    Our services are initiated through direct contact. Customers engage in a call with us, during which we analyze their needs and outline the process for an in-depth security audit using our algorithms and developer workforce.
                </p>

                <h3 className="text-xl font-medium mt-4 mb-2">3. Intellectual Property</h3>
                <p>
                    The software we use to check for security and reliability flaws in code is open-source. However, all aspects of our audit process and methodologies remain proprietary and confidential.
                </p>

                <h3 className="text-xl font-medium mt-4 mb-2">4. Refund and Dispute Policy</h3>
                <p>
                    Customers may request a refund until the first meeting is conducted. After this point, no disputes or refunds will be considered.
                </p>

                <h3 className="text-xl font-medium mt-4 mb-2">5. Limitation of Liability</h3>
                <p>
                    While we strive for accuracy and thoroughness in our audits, App-Prove is not liable for any indirect, incidental, or consequential damages arising from the use of our services or reliance on our audit reports.
                </p>

                <h3 className="text-xl font-medium mt-4 mb-2">6. Compliance</h3>
                <p>
                    Our services aim to comply with GDPR, SOC 2, and HIPAA regulations. However, it is the client&apos;s responsibility to ensure their own compliance with these standards.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Privacy Policy</h2>

                <h3 className="text-xl font-medium mt-4 mb-2">1. Data Collection and Use</h3>
                <p>
                    We collect and process personal data necessary for providing our services, including contact information and details about your software and infrastructure. This data is used solely for the purpose of conducting security audits and communicating with clients.
                </p>

                <h3 className="text-xl font-medium mt-4 mb-2">2. Data Protection</h3>
                <p>
                    We implement robust security measures to protect your data from unauthorized access, alteration, disclosure, or destruction. Our practices align with GDPR, SOC 2, and HIPAA requirements for data protection.
                </p>

                <h3 className="text-xl font-medium mt-4 mb-2">3. Data Retention</h3>
                <p>
                    We retain personal data only for as long as necessary to provide our services and comply with legal obligations. You may request the deletion of your data at any time, subject to any overriding legal retention requirements.
                </p>

                <h3 className="text-xl font-medium mt-4 mb-2">4. Your Rights</h3>
                <p>
                    Under GDPR, you have the right to access, correct, or delete your personal data. You may also request a copy of your data or object to its processing. To exercise these rights, please contact us at privacy@app-prove.com.
                </p>

                <h3 className="text-xl font-medium mt-4 mb-2">5. Third-Party Disclosure</h3>
                <p>
                    We do not sell, trade, or otherwise transfer your personal information to outside parties. This does not include trusted third parties who assist us in operating our service, so long as they agree to keep this information confidential.
                </p>
            </section>

            <p className="mt-8">
                For any questions or concerns regarding our legal terms or privacy policy, please contact us at:
            </p>
            <p>Email: <Link href="mailto:legal@app-prove.com" className="text-blue-600 hover:underline">legal@app-prove.com</Link></p>
        </div>
    )
}
