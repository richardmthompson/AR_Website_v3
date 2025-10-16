# External Best Practices Research: Email Submission & Notification Systems

**Research Date:** October 15, 2025
**Purpose:** Authoritative resources for implementing email capture and notification systems
**Scope:** FastAPI backend endpoints, React frontend forms, Resend API integration

---

## FastAPI Email Endpoints

### 1. Official Resend FastAPI Documentation
- **URL**: https://resend.com/docs/send-with-fastapi
- **Why**: Official integration guide for Resend with FastAPI
- **Key Insight**: Simple implementation requires only the `resend` package and API key configuration
- **Code Pattern**:
  ```python
  import resend
  from fastapi import FastAPI

  resend.api_key = "re_xxxxxxxxx"
  app = FastAPI()

  @app.post("/")
  def send_mail():
      params: resend.Emails.SendParams = {
          "from": "onboarding@resend.dev",
          "to": ["delivered@resend.dev"],
          "subject": "Hello World",
          "html": "<strong>it works!</strong>",
      }
      email: resend.Email = resend.Emails.send(params)
      return email
  ```
- **Setup Requirements**: `pip install resend`, API key, domain verification

### 2. FastAPI Form Data Handling
- **URL**: https://fastapi.tiangolo.com/tutorial/request-forms/
- **Why**: Official documentation for handling form-encoded data (vs JSON)
- **Key Insight**: Requires `python-multipart` package; cannot mix Form() with JSON Body in same endpoint
- **Code Pattern**:
  ```python
  from fastapi import FastAPI, Form
  from typing import Annotated

  @app.post("/contact")
  async def contact(
      name: Annotated[str, Form()],
      email: Annotated[str, Form()],
      message: Annotated[str, Form()]
  ):
      return {"status": "received"}
  ```
- **Critical Gotcha**: Form data uses `application/x-www-form-urlencoded`, not JSON

### 3. Pydantic EmailStr Validation
- **URL**: https://stackoverflow.com/questions/76972389/fastapi-pydantic-how-to-validate-email
- **Why**: Built-in email validation for Pydantic models
- **Key Insight**: Requires `email-validator` package; automatically validates RFC-compliant email format
- **Code Pattern**:
  ```python
  from pydantic import BaseModel, EmailStr, Field

  class ContactForm(BaseModel):
      name: str = Field(min_length=3)
      email: EmailStr
      message: str

  @app.post("/contact")
  async def submit_contact(form: ContactForm):
      return {"status": "success", "data": form}
  ```
- **Critical Gotcha**: Database uniqueness checks should NOT be in Pydantic validators; handle in route logic

### 4. Complete Contact Form API Example
- **GitHub URL**: https://github.com/nguyenhongthe/contact_form_api
- **Why**: Production-ready reference implementation with PostgreSQL, SMTP, and Discord webhooks
- **Pattern**:
  - Uses `application/x-www-form-urlencoded` form data
  - Stores submissions in PostgreSQL via SQLAlchemy
  - Sends notifications via SMTP and Discord
  - Provides Swagger/ReDoc documentation
- **Example cURL**:
  ```bash
  curl -X 'POST' \
    'http://localhost:8000/submit-contact-form' \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -d 'name=My%20Name&email=myname@gmail.com&phone=0123456789&title=Hello&message=Hello%20World'
  ```

### 5. FastAPI POST Endpoints Best Practices
- **URL**: https://www.browserstack.com/guide/fastapi-post
- **Why**: Comprehensive guide to POST endpoint design in FastAPI
- **Key Insight**: Pydantic models provide automatic validation, type checking, and OpenAPI documentation
- **Pattern**: When validation fails, FastAPI automatically returns detailed 422 error responses

---

## React Form Handling

### 1. React Hook Form Success State Management
- **URL**: https://carlrippon.com/successful-submission-in-react-hook-form/
- **Why**: Authoritative guide on tracking submission success (not just submission)
- **Key Insight**: `formState.isSubmitted` only indicates form was submitted, NOT that it succeeded; use custom state for success
- **Code Pattern**:
  ```typescript
  const [isSuccessfullySubmitted, setIsSuccessfullySubmitted] = useState(false);
  const { register, handleSubmit, formState } = useForm<FormData>();

  const submitForm = async (data: FormData) => {
      const result = await postData(data);
      setIsSuccessfullySubmitted(result.success);
  };

  return (
      <form onSubmit={handleSubmit(submitForm)}>
          <input
              {...register("name", { required: true })}
              disabled={formState.isSubmitting || isSuccessfullySubmitted}
          />
          {isSuccessfullySubmitted && (
              <div className="success">Form submitted successfully</div>
          )}
      </form>
  );
  ```
- **Critical Gotcha**: Disable inputs during submission AND after success to prevent double-submission

### 2. React Form Best Practices 2025
- **URL**: https://medium.com/@farzanekazemi8517/best-practices-for-handling-forms-in-react-2025-edition-62572b14452f
- **Why**: Current best practices for form handling in React 19/2025
- **Key Insights**:
  - React Hook Form is the recommended library for 2025
  - React 19 introduces `useActionState` and `useFormStatus` for built-in form state management
  - Always call `event.preventDefault()` to avoid page reloads
  - Provide immediate feedback with loading states and error messages
- **Pattern**: Use `formState.isSubmitting` for loading indicators

### 3. React Form Loading States
- **URL**: https://medium.com/@ryangan.dev/handling-form-loading-states-in-next-js-react-2024-33da2dae11ce
- **Why**: Best practices for loading state UX
- **Key Insight**: Set loading state in `beforeSend`, clear in `success`/`error`, render loading component conditionally
- **Pattern**:
  ```typescript
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data) => {
      setIsLoading(true);
      try {
          await submitForm(data);
          setSuccess(true);
      } catch (error) {
          setError(error);
      } finally {
          setIsLoading(false);
      }
  };
  ```

### 4. Controlled vs Uncontrolled Components
- **URL**: https://www.freecodecamp.org/news/what-are-controlled-and-uncontrolled-components-in-react/
- **Why**: Understanding when to use controlled components (React state) vs uncontrolled (DOM state)
- **Key Insight**: Controlled components are recommended for most forms in 2025
- **When to Use Controlled**:
  - Complex forms with validation
  - Instant feedback/dynamic UI
  - Conditional rendering based on input
- **When to Use Uncontrolled**:
  - Simple forms with minimal validation
  - Performance-critical forms (hundreds of fields)
  - Legacy code integration
- **Critical Gotcha**: React Hook Form uses uncontrolled inputs internally for performance

### 5. React Hook Form vs React 19
- **URL**: https://blog.logrocket.com/react-hook-form-complete-guide/
- **Why**: Evaluating whether to use React Hook Form in 2025 vs React 19 built-in features
- **Key Insight**: React Hook Form is still recommended for production apps in 2025 due to:
  - Minimal re-renders (subscription-based state management)
  - Built-in validation with schema libraries (Zod, Yup)
  - Mature ecosystem with extensive features
- **Pattern**: React Hook Form remains the standard for complex forms

---

## Email Services (Resend)

### 1. Resend API Rate Limits
- **URL**: https://resend.com/docs/api-reference/rate-limit
- **Why**: Understanding rate limits to prevent 429 errors
- **Key Details**:
  - **Default Limit**: 2 requests per second
  - **Error Code**: 429 (Too Many Requests)
  - **Response Headers**:
    - `ratelimit-limit`: Max requests per window
    - `ratelimit-remaining`: Requests left in current window
    - `ratelimit-reset`: Seconds until limits reset
    - `retry-after`: Seconds to wait before retry
- **Critical Gotcha**: For high-traffic contact forms, implement queue mechanism or request increased limits from Resend support

### 2. Handling Resend Rate Limits
- **URL**: https://developers.cloudflare.com/queues/tutorials/handle-rate-limits/
- **Why**: Production pattern for handling external API rate limits
- **Key Insight**: Use queue system (Cloudflare Queues, Redis Queue, Celery) to buffer requests
- **Pattern**:
  - Accept contact form submissions immediately
  - Queue email sending tasks
  - Process queue at rate matching Resend limits (2/second)
  - Set `max_batch_size: 2` to match Resend's limit
- **Best Practice**: Monitor Resend Logs page for 429 responses

### 3. Resend Email Parameters
- **Documentation**: Resend API supports multiple parameters beyond basic example:
  - `from`: Verified sender address
  - `to`: Array of recipient addresses
  - `subject`: Email subject line
  - `html`: HTML email body
  - `text`: Plain text fallback
  - `reply_to`: Reply-to address (useful for contact forms)
  - `cc`, `bcc`: Additional recipients
- **Critical Gotcha**: `from` address must be from verified domain

### 4. Resend Setup Requirements
- **Steps**:
  1. Create Resend account at resend.com
  2. Generate API key in dashboard
  3. Verify domain (DNS configuration)
  4. Install SDK: `pip install resend`
- **Best Practice**: Use environment variables for API keys, never hardcode

---

## Validation Patterns

### 1. Pydantic Email Validation
- **URL**: https://www.mindbowser.com/fastapi-data-validation-pydantic/
- **Why**: Understanding Pydantic's validation capabilities
- **Key Insights**:
  - `EmailStr` validates RFC-compliant email format
  - Requires `email-validator` package: `pip install email-validator`
  - Automatic validation errors with detailed messages
  - Integrates with FastAPI OpenAPI documentation
- **Code Pattern**:
  ```python
  from pydantic import BaseModel, EmailStr, Field

  class ContactRequest(BaseModel):
      name: str = Field(min_length=2, max_length=100)
      email: EmailStr
      message: str = Field(min_length=10, max_length=1000)
  ```

### 2. Custom Pydantic Validators
- **URL**: https://www.fastapitutorial.com/blog/pydantic-data-validation/
- **Why**: When built-in validators aren't sufficient
- **Key Insight**: Use `@field_validator` decorator for custom validation logic
- **Pattern**:
  ```python
  from pydantic import BaseModel, field_validator

  class ContactForm(BaseModel):
      email: str

      @field_validator('email')
      def validate_email_domain(cls, v):
          if not v.endswith('@company.com'):
              raise ValueError('Must use company email')
          return v
  ```
- **Critical Gotcha**: Don't put database queries in validators; keep validators pure

### 3. React Hook Form with Zod Validation
- **URL**: https://react-hook-form.com/advanced-usage
- **Why**: Type-safe client-side validation
- **Key Insight**: Combine React Hook Form with Zod for schema validation
- **Pattern**:
  ```typescript
  import { useForm } from 'react-hook-form';
  import { zodResolver } from '@hookform/resolvers/zod';
  import { z } from 'zod';

  const schema = z.object({
      name: z.string().min(2, 'Name too short'),
      email: z.string().email('Invalid email'),
      message: z.string().min(10, 'Message too short'),
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
      resolver: zodResolver(schema)
  });
  ```

### 4. FastAPI Validation Error Handling
- **URL**: https://craftyourstartup.com/cys-docs/fastapi-pydantic-validation/
- **Why**: Understanding how FastAPI returns validation errors
- **Key Insights**:
  - Automatic 422 Unprocessable Entity responses
  - Detailed error messages with field locations
  - JSON error format: `{"detail": [{"loc": ["body", "email"], "msg": "value is not a valid email address"}]}`
- **Pattern**: Frontend should parse `detail` array and display field-specific errors

---

## Example Implementations

### 1. FastAPI Background Tasks for Email
- **GitHub URL**: https://github.com/maxwellwachira/FastAPI-Mail
- **Why**: Production pattern for non-blocking email sending
- **Pattern**:
  ```python
  from fastapi import BackgroundTasks

  @app.post("/contact")
  async def submit_contact(
      form: ContactForm,
      background_tasks: BackgroundTasks
  ):
      background_tasks.add_task(send_email, form)
      return {"status": "received"}

  async def send_email(form: ContactForm):
      params = {
          "from": "contact@company.com",
          "to": ["admin@company.com"],
          "subject": f"Contact from {form.name}",
          "html": f"<p>Email: {form.email}</p><p>{form.message}</p>",
      }
      resend.Emails.send(params)
  ```
- **Why This Pattern**: Returns immediate response to user while email sends asynchronously

### 2. FastAPI with Email Templates
- **Stack Overflow URL**: https://stackoverflow.com/questions/74797468/how-to-send-email-in-fastapi-with-template
- **Why**: Professional HTML email formatting
- **Pattern**:
  - Use Jinja2 for email templates
  - Store templates in `templates/` directory
  - Pass dynamic data to templates
- **Example**:
  ```python
  from jinja2 import Environment, FileSystemLoader

  env = Environment(loader=FileSystemLoader('templates'))
  template = env.get_template('contact_notification.html')
  html_content = template.render(
      name=form.name,
      email=form.email,
      message=form.message
  )
  ```

### 3. React Form with TanStack Query
- **Pattern**: Use TanStack Query for form submission (matches AR Automation stack)
  ```typescript
  import { useMutation } from '@tanstack/react-query';

  const submitContactForm = useMutation({
      mutationFn: async (data: ContactFormData) => {
          const res = await fetch('/api/contact', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data),
          });
          if (!res.ok) throw new Error('Failed to submit');
          return res.json();
      },
      onSuccess: () => {
          setSuccessMessage('Thank you! We will be in touch soon.');
      },
      onError: (error) => {
          setErrorMessage('Failed to submit. Please try again.');
      },
  });

  const handleSubmit = (data: ContactFormData) => {
      submitContactForm.mutate(data);
  };
  ```

### 4. FastAPI-Mail Library (Alternative to Resend)
- **GitHub URL**: https://github.com/sabuhish/fastapi-mail
- **Why**: SMTP-based alternative for more control
- **Pattern**: Supports Gmail, Outlook, custom SMTP servers
- **Use Case**: When Resend isn't suitable (e.g., existing SMTP infrastructure)

---

## Rate Limiting Implementation

### 1. SlowAPI for FastAPI Rate Limiting
- **GitHub URL**: https://github.com/laurentS/slowapi
- **Why**: Protect contact form endpoints from abuse
- **Pattern**:
  ```python
  from slowapi import Limiter, _rate_limit_exceeded_handler
  from slowapi.util import get_remote_address
  from slowapi.errors import RateLimitExceeded

  limiter = Limiter(key_func=get_remote_address)
  app.state.limiter = limiter
  app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

  @app.post("/contact")
  @limiter.limit("5/minute")  # 5 submissions per minute per IP
  async def submit_contact(request: Request, form: ContactForm):
      # Handle submission
      pass
  ```
- **Best Practice**: Combine endpoint rate limiting with Resend rate limit handling

### 2. Redis-Based Rate Limiting
- **URL**: https://github.com/long2ice/fastapi-limiter
- **Why**: Distributed rate limiting for multiple servers
- **Pattern**: Uses Redis to track requests across instances
- **Use Case**: Production deployments with multiple containers/servers

---

## Security Considerations

### 1. Email Validation Best Practices
- Always validate email format on both client and server
- Use EmailStr for server-side validation (RFC compliance)
- Consider domain blocklists (disposable email providers)
- Implement rate limiting per IP address

### 2. Preventing Spam
- Add CAPTCHA or honeypot fields (invisible to users)
- Rate limit submissions per IP (5-10 per hour recommended)
- Log all submissions for abuse detection
- Consider email verification (double opt-in)

### 3. Error Message Security
- Don't reveal internal system details in errors
- Use generic messages: "Failed to submit form" vs "Database connection failed"
- Log detailed errors server-side only

---

## Recommended Tech Stack for AR Automation

Based on research and existing stack (FastAPI + React):

### Backend:
- **Framework**: FastAPI (already in use)
- **Email Service**: Resend (simple, modern, reliable)
- **Validation**: Pydantic with EmailStr (built-in)
- **Rate Limiting**: SlowAPI (simple, effective)
- **Background Tasks**: FastAPI BackgroundTasks (built-in)

### Frontend:
- **Form Library**: React Hook Form (performance, minimal re-renders)
- **Validation**: Zod (type-safe, matches backend validation)
- **Data Fetching**: TanStack Query (already in use)
- **UI Components**: Radix UI (shadcn/ui) (already in use)

### Infrastructure:
- **Queue** (if needed): Redis Queue or Celery for high-traffic scenarios
- **Database**: PostgreSQL (already in use) for storing submissions

---

## Implementation Checklist

### Backend Setup:
- [ ] Install dependencies: `resend`, `email-validator`, `python-multipart`, `slowapi`
- [ ] Configure Resend API key in environment variables
- [ ] Create Pydantic model with EmailStr validation
- [ ] Implement POST endpoint with rate limiting
- [ ] Add background task for email sending
- [ ] Create email template (HTML)
- [ ] Test with curl/Postman
- [ ] Monitor Resend logs for 429 errors

### Frontend Setup:
- [ ] Install dependencies: `react-hook-form`, `zod`, `@hookform/resolvers`
- [ ] Create form component with controlled inputs
- [ ] Add Zod schema for client-side validation
- [ ] Implement loading state (disable submit button)
- [ ] Add success message display
- [ ] Add error handling and display
- [ ] Test form submission flow
- [ ] Verify mobile responsiveness

### Testing:
- [ ] Test email delivery
- [ ] Test validation errors (invalid email, missing fields)
- [ ] Test rate limiting (multiple rapid submissions)
- [ ] Test loading states and success messages
- [ ] Test error scenarios (network failure, API errors)

---

## Additional Resources

### Official Documentation:
- FastAPI: https://fastapi.tiangolo.com
- Resend: https://resend.com/docs
- React Hook Form: https://react-hook-form.com
- Zod: https://zod.dev
- Pydantic: https://docs.pydantic.dev

### Community Resources:
- FastAPI Discussions: https://github.com/tiangolo/fastapi/discussions
- React Hook Form Examples: https://github.com/react-hook-form/react-hook-form/tree/master/examples

---

**Last Updated**: October 15, 2025
**Next Review**: When implementing contact form feature
