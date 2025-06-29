import React from "react";
import "../styles/PrivacyPolicy.css";
import Welcome_Navbar from "../components/Welcome_Navbar";
import Footer from "../components/Footer";

const Privacy = () => {
  return (
    <>
      <Welcome_Navbar />
      <div className="privacy-policy-container">
        <div className="privacy-policy-content">
          <div className="privacy-header">
            <h1>Privacy Policy for TellYouDoc</h1>
            <p className="last-updated">Last Updated: June 30, 2025</p>
          </div>

          <section className="privacy-section">
            <h2>Introduction</h2>
            <p>
              TellYouDoc ("we," "us," or "our") is committed to protecting the
              privacy of your personal information. This Privacy Policy
              describes how we collect, use, process, store, and disclose your
              personal information when you use our mobile application and
              website (collectively, the "Platform"). This policy applies to all
              users of our Platform, including doctors, patients, and
              caregivers. By accessing or using the Platform, you agree to the
              terms of this Privacy Policy. If you do not agree with any part of
              this Privacy Policy, you must not use the Platform.
            </p>
            <p>
              This Privacy Policy is published in compliance with, inter alia,
              the Information Technology Act, 2000, and the Information
              Technology (Reasonable Security Practices and Procedures and
              Sensitive Personal Data or Information) Rules, 2011 (the "SPI
              Rules"), and the Digital Personal Data Protection Act, 2023 (DPDP
              Act).
            </p>
          </section>

          <section className="privacy-section">
            <h2>1. Definitions</h2>
            <ul className="definitions-list">
              <li>
                <strong>Personal Information:</strong> Any information that
                relates to a natural person, which, either directly or
                indirectly, in combination with other information available or
                likely to be available to a body corporate, is capable of
                identifying such person.
              </li>
              <li>
                <strong>Sensitive Personal Data or Information (SPDI):</strong>{" "}
                Personal information about a person relating to passwords,
                financial information (bank accounts, credit/debit card
                details), physical, physiological, and mental health condition,
                sexual orientation, medical records and history, biometric
                information, and any other information received by a body
                corporate under lawful contract or otherwise.
              </li>
              <li>
                <strong>Data Principal:</strong> The individual to whom the
                personal data relates (i.e., you, the user).
              </li>
              <li>
                <strong>Data Fiduciary:</strong> The entity that determines the
                purpose and means of processing personal data (i.e.,
                TellYouDoc).
              </li>
              <li>
                <strong>Platform:</strong> Refers to the TellYouDoc mobile
                application and website.
              </li>
              <li>
                <strong>Users:</strong> Refers to doctors, patients, and
                caregivers who use the TellYouDoc Platform.
              </li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>2. Information We Collect</h2>
            <p>
              We collect various types of information from and about you for the
              purposes outlined in this Privacy Policy. This information may
              include, but is not limited to, the following categories:
            </p>

            <div className="subsection">
              <h3>A. Information You Provide to Us</h3>
              <p>
                We collect information that you voluntarily provide to us when
                you register for an account, use our services, communicate with
                us, or otherwise interact with the Platform. This includes:
              </p>
              <ul>
                <li>
                  <strong>Contact Information:</strong> Name, email address,
                  phone number, postal address, and other similar contact data.
                </li>
                <li>
                  <strong>Demographic Information:</strong> Gender, date of
                  birth, and pin code.
                </li>
                <li>
                  <strong>Account Information:</strong> Username, password, and
                  other registration details.
                </li>
                <li>
                  <strong>Health-Related Information (SPDI):</strong> Medical
                  history, health status, details of treatment plans, medication
                  prescribed, laboratory testing results, and any other health
                  information you choose to provide. For doctors, this may
                  include their specialization, qualifications, and professional
                  registration details.
                </li>
                <li>
                  <strong>Financial Information:</strong> Payment instrument
                  information, transaction history, and preferences (if any
                  payment services are introduced in the future).
                </li>
                <li>
                  <strong>Communication Data:</strong> Information shared by you
                  through emails, chat, or other correspondence with us.
                </li>
                <li>
                  <strong>User-Generated Content:</strong> Reviews, feedback,
                  opinions, images, and other documents/files you upload or
                  share on the Platform.
                </li>
              </ul>
            </div>

            <div className="subsection">
              <h3>B. Information Collected Automatically</h3>
              <p>
                When you access or use our Platform, we may automatically
                collect certain technical and usage information. This includes:
              </p>
              <ul>
                <li>
                  <strong>Technical Information:</strong> Internet Protocol (IP)
                  address, device type, operating system, browser type, unique
                  device identifiers, and mobile network information.
                </li>
                <li>
                  <strong>Usage Data:</strong> Information about how you
                  interact with the Platform, such as pages visited, features
                  used, time spent on the Platform, and referring URLs.
                </li>
                <li>
                  <strong>Cookies and Similar Technologies:</strong> We use
                  cookies, pixels, and similar technologies to collect
                  information about your browsing activities and preferences.
                  You can manage your cookie preferences through your browser
                  settings.
                </li>
              </ul>
            </div>

            <div className="subsection">
              <h3>C. Information from Other Sources</h3>
              <p>
                We may obtain information about you from other sources, such as
                third-party service providers (e.g., analytics providers) or
                publicly available sources, where permitted by law. If you
                authorize a third-party website to interact with our Platform,
                we may receive information from that website.
              </p>
            </div>
          </section>

          <section className="privacy-section">
            <h2>3. How We Use Your Information</h2>
            <p>
              We use the information we collect from you for various purposes,
              including:
            </p>
            <ul>
              <li>
                <strong>Providing and Improving Services:</strong> To operate,
                maintain, and provide the features and functionality of the
                Platform, including facilitating communication between doctors,
                patients, and caregivers, and managing appointments. We also use
                this information to improve our services, develop new features,
                and enhance user experience.
              </li>
              <li>
                <strong>Personalization:</strong> To personalize your experience
                on the Platform, such as displaying relevant health information
                or connecting you with appropriate healthcare professionals.
              </li>
              <li>
                <strong>Communication:</strong> To communicate with you about
                your account, services, updates, security alerts, and
                administrative messages. We may also send you promotional
                communications about our products and services, from which you
                can opt-out at any time.
              </li>
              <li>
                <strong>Research and Analysis:</strong> To conduct research,
                statistical analysis, and business intelligence purposes in an
                aggregated or non-personally identifiable form. This helps us
                understand user behavior, identify trends, and improve our
                Platform.
              </li>
              <li>
                <strong>Security and Fraud Prevention:</strong> To detect,
                prevent, and address technical issues, security incidents, and
                fraudulent activities.
              </li>
              <li>
                <strong>Legal Compliance:</strong> To comply with applicable
                laws, regulations, legal processes, and governmental requests,
                including responding to subpoenas or court orders.
              </li>
              <li>
                <strong>Enforcement of Terms:</strong> To enforce our Terms and
                Conditions and other policies, and to protect our rights,
                privacy, safety, or property, and that of our users or the
                public.
              </li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>4. How We Share Your Information</h2>
            <p>
              We may share your information with the following categories of
              third parties for the purposes described in this Privacy Policy:
            </p>
            <ul>
              <li>
                <strong>Healthcare Professionals:</strong> We share relevant
                health-related information with doctors to facilitate online
                consultations and provide medical services. This sharing is done
                with your explicit consent.
              </li>
              <li>
                <strong>Caregivers:</strong> If you designate a caregiver, we
                may share relevant information with them to assist in managing
                your health or the patient's health.
              </li>
              <li>
                <strong>Service Providers:</strong> We may engage third-party
                service providers to perform functions on our behalf, such as
                cloud hosting, data analytics, payment processing (if
                applicable), and customer support. These service providers are
                obligated to protect your information and use it only for the
                purposes for which it was disclosed.
              </li>
              <li>
                <strong>Legal and Regulatory Authorities:</strong> We may
                disclose your information if required by law, regulation, or
                legal process, or if we believe it is necessary to protect our
                rights, property, or safety, or the rights, property, or safety
                of others.
              </li>
              <li>
                <strong>Business Transfers:</strong> In the event of a merger,
                acquisition, reorganization, or sale of all or a portion of our
                assets, your information may be transferred to the acquiring
                entity.
              </li>
              <li>
                <strong>Aggregated or Anonymized Data:</strong> We may share
                aggregated or anonymized data that does not personally identify
                you with third parties for research, marketing, analytics, or
                other purposes.
              </li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>5. Data Security</h2>
            <p>
              We implement reasonable security measures to protect your personal
              information from unauthorized access, disclosure, alteration, and
              destruction. These measures include technical, administrative, and
              physical safeguards designed to protect the confidentiality,
              integrity, and availability of your data. However, no method of
              transmission over the internet or electronic storage is 100%
              secure, and we cannot guarantee absolute security of your
              information.
            </p>
          </section>

          <section className="privacy-section">
            <h2>6. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to
              provide the services you have requested, to comply with our legal
              obligations, resolve disputes, and enforce our agreements. When
              your personal information is no longer required for these
              purposes, we will securely delete or anonymize it.
            </p>
          </section>

          <section className="privacy-section">
            <h2>7. Your Rights and Choices</h2>
            <p>
              As a Data Principal, you have certain rights regarding your
              personal information, subject to applicable laws. These rights may
              include:
            </p>
            <ul>
              <li>
                <strong>Right to Access:</strong> You have the right to request
                access to your personal information that we hold.
              </li>
              <li>
                <strong>Right to Correction:</strong> You have the right to
                request that we correct any inaccurate or incomplete personal
                information.
              </li>
              <li>
                <strong>Right to Erasure (Right to be Forgotten):</strong> You
                have the right to request the deletion of your personal
                information under certain circumstances.
              </li>
              <li>
                <strong>Right to Object:</strong> You have the right to object
                to the processing of your personal information under certain
                circumstances.
              </li>
              <li>
                <strong>Right to Restriction of Processing:</strong> You have
                the right to request that we restrict the processing of your
                personal information under certain circumstances.
              </li>
              <li>
                <strong>Right to Data Portability:</strong> You have the right
                to receive your personal information in a structured, commonly
                used, and machine-readable format.
              </li>
              <li>
                <strong>Right to Withdraw Consent:</strong> You have the right
                to withdraw your consent to the processing of your personal
                information at any time, where processing is based on consent.
              </li>
            </ul>
            <p>
              To exercise any of these rights, please contact us using the
              contact information provided below. We will respond to your
              request in accordance with applicable laws.
            </p>
          </section>

          <section className="privacy-section">
            <h2>8. Children's Privacy</h2>
            <p>
              The TellYouDoc Platform is not intended for use by individuals
              under the age of 18. We do not knowingly collect personal
              information from children. If we become aware that we have
              collected personal information from a child without parental
              consent, we will take steps to delete such information from our
              records.
            </p>
          </section>

          <section className="privacy-section">
            <h2>9. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect
              changes in our practices or legal requirements. We will notify you
              of any material changes by posting the updated Privacy Policy on
              the Platform and updating the "Last Updated" date. Your continued
              use of the Platform after the effective date of the revised
              Privacy Policy constitutes your acceptance of the updated terms.
            </p>
          </section>

          <section className="privacy-section">
            <h2>10. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or our data
              practices, please contact us at:
            </p>
            <div className="contact-info">
              <p>
                <strong>Precise Medication Research Private Limited</strong>
              </p>
              <p>
                Indian Institute of Information Technology Guwahati (IIITG),
              </p>
              <p>Bongora, Guwahati, Assam - 781015</p>
              <p>
                Email:{" "}
                <a href="mailto:contact@tellyoudoc.com">
                  contact@tellyoudoc.com
                </a>
              </p>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Privacy;
