export type Lang = "en" | "ar";

export const translations = {
  en: {
    nav: {
      links: [
        {
          label: "National Curriculum",
          description:
            "Access Lebanese Ministry of education e-learning platform - Madristi.",
        },
        {
          label: "Learning Corner",
          description:
            "Access General educational videos for all grade levels.",
        },
        {
          label: "Learning with extra steps",
          description:
            "Learn your way: Educational Videos made easy by professionals.",
        },
        {
          label: "Kid to Kid Tutoring",
          description:
            "study with me, Educational videos made easy - by kids for kids.",
        },
        {
          label: "Wellbeing",
          description:
            "Feel your best, heart and mind videos by professionals.",
        },
      ],
      myLearning: "My Learning",
      myLearningDesc: "Your personal learning dashboard and progress tracker.",
      teaching: "Teaching",
      teachingDesc: "Create and manage your courses for students.",
      signIn: "Sign In",
      createAccount: "Create Account",
    },
    landing: {
      hero: {
        pill: "Free Learning for All",
        titleLine1: "Knowledge is the",
        titleLine2: "great equalizer.",
        subtitle:
          "Access free, curated educational videos. Built for learners, especially those who need it most.",
        cta1: "Start Learning Free →",
        cta2: "Browse Courses",
        trust: ["No credit card", "No ads ever", "Always free"],
      },
      curriculum: {
        label: "National Curriculum: select your public school",
        caza: "Caza",
        area: "Area",
        school: "School",
        bannerTitle: "Lebanese Ministry of Education - Madristi Platform",
        hint: "Select your school above to continue",
        visitingAs: "Visiting as:",
        visitBtn: "Visit Madristi →",
        official: "Official",
      },
      courses: {
        heading: "Explore Courses",
        viewAll: "View All Courses",
        noCoursesMsg: "No courses yet. Be the first Professional to add one!",
        registerBtn: "Register as Professional",
      },
      mission: {
        label: "Our Mission",
        title: "Why No Kid Behind?",
        subtitle:
          "We believe that geography, income, and circumstance should never determine a child's access to knowledge.",
      },
      features: [
        {
          title: "Always Free",
          body: "No paywalls, no subscriptions ever. Learning should never come with a price tag.",
        },
        {
          title: "Built for Everyone",
          body: "All learners are granted access to quality content.",
        },
        {
          title: "Curated Videos",
          body: "Videos are made by students and professionals ; organized by grade and subjects.",
        },
        {
          title: "Community Driven",
          body: "Students and professionals contribute because they believe that education and wellbeing are rights for every child.",
        },
      ],
      stats: {
        heading: "Trusted by students across Lebanon",
        items: [
          { value: "100%", label: "Always Free" },
          { value: "24/7", label: "Global Access" },
        ],
      },
      cta: {
        title: "Ready to start learning?",
        subtitle:
          "Join thousands of students who already have access to free, quality education, no matter where they are.",
        btn1: "Create Free Account",
        btn2: "Browse First",
      },
      footer: {
        desc: "a learning platform dedicated to providing quality educational content to anyone, anywhere, at no cost.",
        joinBtn: "Join the Platform",
        platformTitle: "Platform",
        platformLinks: [
          "Explore Videos",
          "Learners",
          "Kid Tutors",
          "Professionals",
        ],
        supportLink: "Support",
        copyright:
          "© 2026 No Kid Behind. Built to grow great minds through learning.",
        legalLinks: [
          { label: "Terms", href: "/legal#terms" },
          { label: "Privacy", href: "/legal#privacy" },
          { label: "Contact", href: null },
        ],
      },
    },
    legal: {
      pageLabel: "Legal",
      pageTitle: "Privacy Policy & Terms of Service",
      lastUpdated:
        "Last updated: May 2026. Please read these documents carefully before using the platform.",
      privacyLabel: "Privacy Policy",
      termsLabel: "Terms of Service",
      questionsTitle: "Questions or concerns?",
      questionsBody:
        "If you have any questions about this Privacy Policy or Terms of Service, please reach out to our support team. We are committed to keeping this platform safe for every child.",
      privacySections: [
        {
          title: "1. Data Collection & Minors",
          body: "We collect only the minimum information needed to provide our services, such as a name, username and email address. We comply with COPPA and GDPR-K standards. We do not track precise geolocation or collect phone numbers from users.",
        },
        {
          title: "2. No Sale of Data",
          body: "We do not sell user data to third parties or advertisers. We do not use behavioral tracking or targeted marketing for children on this platform.",
        },
        {
          title: "3. Parental Control",
          body: "Parents and guardians have the right to review, edit, or request the deletion of their child's data at any time. If you wish to have your data or your child's data removed, please contact our support team for immediate processing.",
        },
        {
          title: "4. Safety in Videos",
          body: 'Users are prohibited from sharing "Personally Identifiable Information" (PII) - such as home addresses and phone numbers - within video content. We reserve the right to blur or remove any videos that compromise a minor\'s privacy or safety.',
        },
        {
          title: "5. Data Retention",
          body: "If an account is closed or registration is revoked, we will delete all associated personal data from our active systems, except where we are legally required to retain specific records for safety audits or compliance.",
        },
      ] as Array<{ title: string; body: string }>,
      termsSections: [
        {
          title: "1. Our Full Authority",
          body: "By using this site, you grant us complete authority over all content. We reserve the absolute right to screen, edit, modify, or permanently delete any video, comment, or user-generated content at any time, for any reason, without prior notice.",
        },
        {
          title: "2. Revocation of Registration",
          body: "We reserve the right to suspend, deactivate, or cancel your account and access to the platform at our sole discretion. This includes, but is not limited to, violations of community rules, safety guidelines, or platform integrity.",
        },
        {
          title: "3. No Responsibility (Limitation of Liability)",
          bullets: [
            'Service "As-Is": We provide this platform for educational purposes on an "as-is" basis. We make no guarantees regarding the accuracy or completeness of the videos posted.',
            "User Actions: We are not responsible for the actions of users, the content of their videos, or any technical issues arising from use.",
            "No Compensation: You agree that we are not liable for any loss of content or data. You are not entitled to compensation or damages if we choose to delete your account or videos.",
          ],
        },
        {
          title: "4. Creator Rules",
          bullets: [
            "License: You (or your professional organization) retain ownership of your videos. However, by posting, you grant us a free, worldwide license to host and display this content to our learners.",
            "Originality: You must only post content you created or have the legal right to use. No copyrighted music, movies, or images are allowed.",
            "Conduct: Bullying, harassment, or inappropriate content will result in an immediate and permanent ban.",
          ],
        },
        {
          title: "5. Agreement",
          body: "Users under the age of 18 must have a parent or guardian review these terms. By creating an account, you agree to abide by these rules and respect our authority to manage the community.",
        },
        {
          title: "6. Indemnification",
          bullets: [
            "Your Responsibility: You agree to indemnify, defend, and hold harmless this platform, its owners, and its affiliates from any and all claims, damages, or legal fees (including attorney's fees) arising from your use of the site.",
            "Scope of Liability: This responsibility applies to any legal issues caused by content or videos you or your child posts, your violation of these Terms of Service or Privacy Policy, or your violation of any third-party rights including copyright, trademark, or privacy rights.",
            "Defense of Claims: In the event of a legal claim, you agree to cooperate fully in our defense. We reserve the right to assume the exclusive defense and control of any matter otherwise subject to indemnification by you, in which case you will still be responsible for all legal costs and expenses.",
          ],
        },
      ] as Array<{ title: string; body?: string; bullets?: string[] }>,
    },
    courses: {
      title: "Learning Corner",
      subtitle: "Access General educational videos for all grade levels",
      countLabel: "Courses Available",
      filters: "Filters",
      searchPlaceholder: "Search by title or subject…",
      gradePlaceholder: "Grade",
      subjectPlaceholder: "Subject…",
      schoolPlaceholder: "School…",
      resultSingular: "course",
      resultPlural: "courses",
      resultFound: "found",
      clearFilters: "Clear filters",
      emptyTitle: "No courses match your search.",
      emptySubtitle: "Try adjusting your filters or search term.",
    },
    extraSteps: {
      title: "Learning with Extra Help",
      subtitle:
        "Learn your way: Educational Videos made easy by professionals.",
      countLabel: "Videos Available",
      filters: "Filter",
      searchPlaceholder: "Search by title or topic…",
      topicPlaceholder: "Topic…",
      resultSingular: "video",
      resultPlural: "videos",
      resultFound: "found",
      clearFilters: "Clear filters",
      emptyTitle: "No videos found.",
      emptySubtitleFiltered: "Try adjusting your filters.",
      emptySubtitleDefault: "Content is being added. Check back soon.",
    },
    kidToKid: {
      overline: "Student-Led Learning",
      title: "Kid to Kid Tutoring",
      subtitle:
        "study with me, Educational videos made easy - by kids for kids",
      countLabel: "Courses Available",
      filters: "Filters",
      searchPlaceholder: "Search by title or subject…",
      gradePlaceholder: "Grade",
      subjectPlaceholder: "Subject…",
      resultSingular: "course",
      resultPlural: "courses",
      resultFound: "found",
      clearFilters: "Clear filters",
      emptyTitle: "No kid-to-kid courses yet.",
      emptySubtitleFiltered: "Try adjusting your filters.",
      emptySubtitleDefault: "Student teachers will start sharing soon!",
    },
    health: {
      title: "Wellbeing",
      subtitle: "Feel your best, heart and mind videos by professionals.",
      countLabel: "Videos Available",
      filters: "Filter",
      searchPlaceholder: "Search by title or topic…",
      topicPlaceholder: "Topic…",
      resultSingular: "video",
      resultPlural: "videos",
      resultFound: "found",
      clearFilters: "Clear filters",
      emptyTitle: "No health videos found.",
      emptySubtitleFiltered: "Try adjusting your filters.",
      emptySubtitleDefault: "Check back soon, content is being added.",
    },
  },

  ar: {
    nav: {
      links: [
        {
          label: "المنهج الوطني",
          description:
            "الوصول إلى منصة التعلّم الإلكتروني لوزارة التربية والتعليم العالي اللبنانية - مدرستي.",
        },
        {
          label: "ركن التعلّم",
          description: "الوصول إلى فيديوهات تعليمية مختلفة لجميع الصفوف.",
        },
        {
          label: "التعلّم مع مساعدة إضافية",
          description: "تعلّم بطريقتك: فيديوهات تعليمية مبسطة من إعداد مختصين.",
        },
        {
          label: "اولاد يدرسون اولاد",
          description:
            "ادرس معي: فيديوهات تعليمية مبسطة - من الاولاد إلى الاولاد.",
        },
        {
          label: "الرفاهية",
          description: "اشعر بأفضل حال: فيديوهات للعقل والقلب من إعداد مختصين.",
        },
      ],
      myLearning: "تعلّمي",
      myLearningDesc: "لوحة التعلم الشخصية ومتابعة تقدّمك.",
      teaching: "التدريس",
      teachingDesc: "أنشئ دروسك وشاركها مع الطلاب.",
      signIn: "تسجيل الدخول",
      createAccount: "انشاء حساب",
    },
    landing: {
      hero: {
        pill: "تعلم مجاني للجميع",
        titleLine1: "المعرفة هي",
        titleLine2: "السبيل الاكبر لتحقيق المساواة",
        subtitle:
          "الوصول الى فيديوهات تعليمية مجانية مختارة بعناية لكل متعلم، وخاصة للذين هم بأمس الحاجة إليها.",
        cta1: "ابدأ التعلم مجاناً",
        cta2: "تصفح الفيديوهات",
        trust: ["لا بطاقة ائتمان", "لا إعلانات", "مجاني دائماً"],
      },
      curriculum: {
        label: "المنهج الوطني: اختر المدرسة الرسمية",
        caza: "القضاء",
        area: "المنطقة",
        school: "المدرسة",
        bannerTitle: "وزارة التربية والتعليم العالي اللبنانية - منصة مدرستي.",
        hint: "اختر مدرستك اعلاه للمتابعة",
        visitingAs: "Visiting as:",
        visitBtn: "تصفح الفيديوهات",
        official: "Official",
      },
      courses: {
        heading: "استكشاف الفيديوهات",
        viewAll: "عرض جميع الفيديوهات",
        noCoursesMsg: "No courses yet. Be the first Professional to add one!",
        registerBtn: "Register as Professional",
      },
      mission: {
        label: "مهمتنا",
        title: "لماذا ضرورة شمول جميع الاولاد ؟",
        subtitle:
          "مهمتنا مساعدة الشباب اللبناني على تخطي ظروفهم عبر تيسير الوصول إلى المواد التعليمية الأساسية، وإنشاء مساحات تتيح للاولاد تعليم ودعم بعضهم البعض، لضمان عدم تخلف أي متعلم عن الركب في التعلم أو الرفاهية.",
      },
      features: [
        {
          title: "مجاني دائماً",
          body: "لا دفع ولا اشتراكات؛ فالتعلم لا يجب أن يكون لقاء مقابل مادي",
        },
        {
          title: "مُصممة للجميع",
          body: "نمنح جميع المتعلمين امكانية الوصول إلى محتوى تعليمي ذو جودة عالية",
        },
        {
          title: "فيديوهات مختارة بعناية",
          body: "محتوى مرئي من إعداد طلاب ومتخصصين، مُنظم حسب المراحل الدراسية والمواد التعليمية",
        },
        {
          title: "جهود مجتمعية",
          body: "مساهمة الطلاب والمهنيون ناتجة عن إيمانهم بأن التعليم والرفاهية هما حق لكل الاولاد",
        },
      ],
      stats: {
        heading: "موثوق من قِبل المتعلمين في جميع أنحاء لبنان",
        items: [
          { value: "100%", label: "دائمًا مجانًا" },
          { value: "24/7", label: "وصول عالمي" },
        ],
      },
      cta: {
        title: "هل أنت مستعد لبدء التعلّم؟",
        subtitle:
          "انضم إلى زملائك من الطلاب والمتعلمين الذين لديهم وصول إلى محتوى تعليمي مجاني أينما كانوا.",
        btn1: "إنشاء حساب مجاني",
        btn2: "تصفّح أولًا",
      },
      footer: {
        desc: "منصة تعليمية مخصصة لتقديم محتوى تعليمي ذات جودة للشباب اللبناني، في أي مكان، ودون مقابل.",
        joinBtn: "انضم إلى المنصة",
        platformTitle: "المنصة",
        platformLinks: [
          "استكشاف الفيديوهات",
          "المتعلمون",
          "الاولاد المدرسون",
          "المهنيون",
        ],
        supportLink: "الدعم",
        copyright:
          "© 2026 No Kid Behind. Built to grow great minds through learning.",
        legalLinks: [
          { label: "Terms", href: "/legal#terms" },
          { label: "Privacy", href: "/legal#privacy" },
          { label: "Contact", href: null },
        ],
      },
    },
    legal: {
      pageLabel: "قانوني",
      pageTitle: "سياسة الخصوصية وشروط الخدمة",
      lastUpdated:
        "آخر تحديث: مايو 2026. يرجى قراءة هذه الوثائق بعناية قبل استخدام المنصة.",
      privacyLabel: "سياسة الخصوصية",
      termsLabel: "شروط الخدمة",
      questionsTitle: "أسئلة أو استفسارات؟",
      questionsBody:
        "إذا كان لديك أي أسئلة حول سياسة الخصوصية أو شروط الخدمة، يرجى التواصل مع فريق الدعم لدينا. نحن ملتزمون بالحفاظ على سلامة المنصة لكل طفل.",
      privacySections: [
        {
          title: "١. جمع البيانات والقصر",
          body: "نحن نجمع الحد الأدنى فقط من المعلومات اللازمة لتقديم خدماتنا، مثل الاسم واسم المستخدم وعنوان البريد الإلكتروني. نلتزم بمعايير قوانين حماية خصوصية الأطفال (مثل COPPA وGDPR-K). لا نقوم بتتبع الموقع الجغرافي الدقيق أو جمع أرقام الهواتف من المستخدمين.",
        },
        {
          title: "٢. عدم بيع البيانات",
          body: "نحن لا نبيع بيانات المستخدمين لأي جهات خارجية أو معلنين. لا نستخدم تقنيات التتبع السلوكي أو التسويق الموجه للأطفال على هذه المنصة.",
        },
        {
          title: "٣. رقابة الوالدين",
          body: "يتمتع الآباء والأوصياء بالحق في مراجعة بيانات أطفالهم أو تعديلها أو طلب حذفها في أي وقت. إذا كنت ترغب في حذف بياناتك أو بيانات طفلك، يرجى الاتصال بفريق الدعم لدينا لاتخاذ الإجراء الفوري.",
        },
        {
          title: "٤. السلامة في الفيديوهات",
          body: 'يُحظر على المستخدمين مشاركة "معلومات التعريف الشخصية" - مثل عناوين السكن، وارقام الهواتف - داخل محتوى الفيديو. نحتفظ بالحق في حجب أو حذف أي فيديوهات تعرض خصوصية أو سلامة القاصرين للخطر.',
        },
        {
          title: "٥. الاحتفاظ بالبيانات",
          body: "في حال إغلاق الحساب أو إلغاء التسجيل، سنقوم بحذف جميع البيانات الشخصية المرتبطة به من أنظمتنا النشطة، باستثناء الحالات التي يطلب فيها القانون الاحتفاظ بسجلات معينة لأغراض تدقيق السلامة أو الامتثال القانوني.",
        },
      ] as Array<{ title: string; body: string }>,
      termsSections: [
        {
          title: "١. سلطتنا الكاملة",
          body: "باستخدامك لهذا الموقع، فإنك تمنحنا سلطة كاملة ومطلقة على جميع المحتويات. نحتفظ بالحق المطلق في فحص، أو تحرير، أو تعديل، أو حذف أي فيديو أو تعليق أو محتوى تم إنشاؤه بواسطة المستخدم بشكل دائم في أي وقت، ولأي سبب، ودون إشعار مسبق.",
        },
        {
          title: "٢. إلغاء التسجيل",
          body: "نحتفظ بالحق في تعليق أو إلغاء تنشيط أو إنهاء حسابك ووصولك إلى المنصة وفقاً لتقديرنا الخاص. يشمل ذلك، على سبيل المثال لا الحصر، انتهاك قواعد المجتمع، أو إرشادات السلامة، أو نزاهة المنصة.",
        },
        {
          title: "٣. عدم المسؤولية (تحديد المسؤولية)",
          bullets: [
            'الخدمة "كما هي": نحن نقدم هذه المنصة لأغراض تعليمية على أساس "كما هي". لا نقدم أي ضمانات فيما يتعلق بدقة أو اكتمال الفيديوهات المنشورة.',
            "أفعال المستخدمين: نحن لسنا مسؤولين عن أفعال المستخدمين، أو محتوى فيديوهاتهم، أو أي مشكلات تقنية ناتجة عن الاستخدام. استخدام الموقع يكون على مسؤوليتك الخاصة.",
            "لا تعويضات: أنت توافق على أننا لسنا مسؤولين عن أي فقدان للمحتوى أو البيانات. لا يحق لك المطالبة بتعويضات أو أضرار إذا قررنا حذف حسابك أو فيديوهاتك.",
          ],
        },
        {
          title: "٤. قواعد منشئي المحتوى",
          bullets: [
            "الترخيص: تحتفظ أنت (أو مؤسستك المهنية) بملكية فيديوهاتك. ومع ذلك، بمجرد النشر، فإنك تمنحنا ترخيصاً مجانياً وعالمياً لاستضافة وعرض هذا المحتوى لطلابنا.",
            "الأصالة: يجب عليك فقط نشر المحتوى الذي أنشأته بنفسك أو تملك الحق القانوني في استخدامه. لا يُسمح باستخدام الموسيقى أو الأفلام أو الصور المحمية بحقوق الطبع والنشر.",
            "السلوك: سيؤدي التنمر، أو المضايقة، أو نشر محتوى غير لائق إلى حظر فوري ودائم للحساب.",
          ],
        },
        {
          title: "٥. الاتفاقية",
          body: "يجب على المستخدمين الذين تقل أعمارهم عن ١٨ عاماً مراجعة هذه الشروط مع ولي الأمر. بإنشاء حساب، فإنك توافق على الالتزام بهذه القواعد واحترام سلطتنا في إدارة المجتمع.",
        },
        {
          title: "6. التعويض",
          bullets: [
            "مسؤوليتك أنت: توافق على تعويض هذه المنصة ومالكيها والشركات التابعة لها، والدفاع عنهم وحمايتهم من أي وجميع المطالبات أو الأضرار أو الرسوم القانونية (بما في ذلك أتعاب المحاماة) الناشئة عن استخدامك للموقع.",
            "نطاق المسؤولية: تنطبق هذه المسؤولية على أي مسائل قانونية ناتجة عن - أي محتوى أو فيديوهات تنشرها أنت أو طفلك على المنصة - انتهاكك لشروط الخدمة هذه أو سياسة الخصوصية - انتهاكك لأي حقوق خاصة بطرف ثالث، بما في ذلك على سبيل المثال لا الحصر حقوق الطبع والنشر، أو العلامات التجارية، أو حقوق الخصوصية.",
            "الدفاع ضد المطالبات: في حالة وجود مطالبة قانونية، فإنك توافق على التعاون الكامل في دفاعنا. نحن نحتفظ بالحق في تولي الدفاع الحصري والسيطرة على أي مسألة تخضع للتعويض من قبلك، وفي هذه الحالة ستظل مسؤولاً عن جميع التكاليف والنفقات القانونية.",
          ],
        },
      ] as Array<{ title: string; body?: string; bullets?: string[] }>,
    },
    courses: {
      title: "ركن التعلّم",
      subtitle: "فيديوهات تعليمية لجميع المراحل الدراسية",
      countLabel: "الفيديوهات المتاحة",
      filters: "تصفية",
      searchPlaceholder: "البحث بالعنوان أو المادة...",
      gradePlaceholder: "الصف",
      subjectPlaceholder: "المادة...",
      schoolPlaceholder: "المدرسة...",
      resultSingular: "نتيجة",
      resultPlural: "نتيجة",
      resultFound: "",
      clearFilters: "مسح التصفية",
      emptyTitle: "لا توجد نتائج مطابقة لبحثك.",
      emptySubtitle: "حاول تعديل كلمات البحث أو عوامل التصفية.",
    },
    extraSteps: {
      title: "التعلّم مع مساعدة إضافية",
      subtitle: "تعلّم بطريقتك: فيديوهات تعليمية مبسّطة من إعداد مختصّين.",
      countLabel: "الفيديوهات المتاحة",
      filters: "تصفية",
      searchPlaceholder: "البحث بالعنوان أو الموضوع...",
      topicPlaceholder: "الموضوع...",
      resultSingular: "نتيجة",
      resultPlural: "نتيجة",
      resultFound: "",
      clearFilters: "مسح التصفية",
      emptyTitle: "لا توجد فيديوهات.",
      emptySubtitleFiltered: "حاول تعديل عوامل التصفية.",
      emptySubtitleDefault: "يتم إضافة المحتوى. تحقق لاحقاً.",
    },
    kidToKid: {
      overline: "تعلّم بقيادة الطلاب",
      title: "اولاد يدرسون اولاد",
      subtitle: "ادرس معي: فيديوهات تعليمية مبسطة - من الاولاد إلى الاولاد",
      countLabel: "الفيديوهات المتاحة",
      filters: "تصفية",
      searchPlaceholder: "البحث بالعنوان أو المادة...",
      gradePlaceholder: "الصف",
      subjectPlaceholder: "المادة...",
      resultSingular: "نتيجة",
      resultPlural: "نتيجة",
      resultFound: "",
      clearFilters: "مسح التصفية",
      emptyTitle: "لا توجد فيديوهات بعد.",
      emptySubtitleFiltered: "حاول تعديل عوامل التصفية.",
      emptySubtitleDefault: "سيبدأ الطلاب المدرسون في المشاركة قريباً!",
    },
    health: {
      title: "الرفاهية",
      subtitle: "اشعر بأفضل حال: فيديوهات للعقل والقلب من إعداد مختصين.",
      countLabel: "الفيديوهات المتاحة",
      filters: "تصفية",
      searchPlaceholder: "البحث بالعنوان أو الموضوع...",
      topicPlaceholder: "الموضوع...",
      resultSingular: "نتيجة",
      resultPlural: "نتيجة",
      resultFound: "",
      clearFilters: "مسح التصفية",
      emptyTitle: "لا توجد فيديوهات.",
      emptySubtitleFiltered: "حاول تعديل عوامل التصفية.",
      emptySubtitleDefault: "تحقق لاحقاً، يتم إضافة المحتوى.",
    },
  },
} as const;
