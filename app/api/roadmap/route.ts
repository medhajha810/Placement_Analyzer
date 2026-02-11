import { NextRequest, NextResponse } from "next/server";

// Comprehensive skill roadmaps
const skillRoadmaps: Record<string, any> = {
  "System Design": {
    name: "System Design",
    duration: "3-4 months",
    difficulty: "Advanced",
    prerequisites: ["Data Structures", "Algorithms", "REST API"],
    phases: [
      {
        phase: 1,
        title: "Fundamentals",
        duration: "2 weeks",
        topics: [
          "Scalability concepts",
          "Load Balancing",
          "Caching strategies",
          "Database indexing"
        ],
        resources: [
          { type: "video", title: "System Design Fundamentals", url: "https://www.youtube.com/watch?v=REB_eGHK_P4", platform: "YouTube" },
          { type: "article", title: "Intro to System Design", url: "https://www.educative.io/blog/complete-guide-to-system-design", platform: "Educative" }
        ]
      },
      {
        phase: 2,
        title: "Database Design",
        duration: "3 weeks",
        topics: [
          "SQL vs NoSQL",
          "Database sharding",
          "Replication strategies",
          "CAP theorem"
        ],
        resources: [
          { type: "video", title: "Database Design Tutorial", url: "https://www.youtube.com/watch?v=ztHopE5Wnpc", platform: "YouTube" },
          { type: "course", title: "Database Design Course", url: "https://www.udemy.com/topic/database-design/", platform: "Udemy" }
        ]
      },
      {
        phase: 3,
        title: "Advanced Patterns",
        duration: "4 weeks",
        topics: [
          "Microservices architecture",
          "Message queues (Kafka, RabbitMQ)",
          "API Gateway patterns",
          "Service discovery"
        ],
        resources: [
          { type: "video", title: "Microservices Explained", url: "https://www.youtube.com/watch?v=j1gU2oGFayY", platform: "YouTube" },
          { type: "book", title: "Designing Data-Intensive Applications", url: "https://www.amazon.com/Designing-Data-Intensive-Applications-Reliable-Maintainable/dp/1449373321", platform: "Amazon" }
        ]
      },
      {
        phase: 4,
        title: "Practice Problems",
        duration: "4 weeks",
        topics: [
          "Design Twitter",
          "Design Uber",
          "Design Instagram",
          "Design Netflix"
        ],
        resources: [
          { type: "practice", title: "System Design Interview Questions", url: "https://github.com/donnemartin/system-design-primer", platform: "GitHub" },
          { type: "course", title: "Grokking System Design", url: "https://www.educative.io/courses/grokking-the-system-design-interview", platform: "Educative" }
        ]
      }
    ],
    milestones: [
      "Understand horizontal vs vertical scaling",
      "Design a URL shortener",
      "Design a distributed cache",
      "Complete 10 system design problems"
    ]
  },
  "Go": {
    name: "Go Programming",
    duration: "2-3 months",
    difficulty: "Intermediate",
    prerequisites: ["Programming basics", "Data Structures"],
    phases: [
      {
        phase: 1,
        title: "Go Basics",
        duration: "2 weeks",
        topics: [
          "Syntax and basic types",
          "Functions and methods",
          "Pointers",
          "Structs and interfaces"
        ],
        resources: [
          { type: "video", title: "Go Tutorial for Beginners", url: "https://www.youtube.com/watch?v=YS4e4q9oBaU", platform: "YouTube" },
          { type: "interactive", title: "Tour of Go", url: "https://go.dev/tour/", platform: "Official" }
        ]
      },
      {
        phase: 2,
        title: "Concurrency",
        duration: "3 weeks",
        topics: [
          "Goroutines",
          "Channels",
          "Select statement",
          "Mutex and sync package"
        ],
        resources: [
          { type: "video", title: "Go Concurrency Patterns", url: "https://www.youtube.com/watch?v=f6kdp27TYZs", platform: "YouTube" },
          { type: "article", title: "Effective Go", url: "https://go.dev/doc/effective_go", platform: "Official" }
        ]
      },
      {
        phase: 3,
        title: "Web Development",
        duration: "3 weeks",
        topics: [
          "HTTP servers",
          "REST APIs with Gin/Echo",
          "Database integration",
          "Middleware"
        ],
        resources: [
          { type: "video", title: "Build REST API in Go", url: "https://www.youtube.com/watch?v=d_L64KT3SFM", platform: "YouTube" },
          { type: "course", title: "Go Web Development", url: "https://www.udemy.com/course/go-programming-language/", platform: "Udemy" }
        ]
      },
      {
        phase: 4,
        title: "Projects",
        duration: "3 weeks",
        topics: [
          "Build a CLI tool",
          "Create a microservice",
          "Implement gRPC service",
          "Deploy to production"
        ],
        resources: [
          { type: "practice", title: "Go by Example", url: "https://gobyexample.com/", platform: "Web" },
          { type: "project", title: "Awesome Go Projects", url: "https://github.com/avelino/awesome-go", platform: "GitHub" }
        ]
      }
    ],
    milestones: [
      "Complete Tour of Go",
      "Build a concurrent web scraper",
      "Create a REST API with database",
      "Deploy a Go microservice"
    ]
  },
  "Kubernetes": {
    name: "Kubernetes",
    duration: "2 months",
    difficulty: "Advanced",
    prerequisites: ["Docker", "Linux basics", "YAML"],
    phases: [
      {
        phase: 1,
        title: "Kubernetes Basics",
        duration: "2 weeks",
        topics: [
          "Pods and containers",
          "Services and networking",
          "ConfigMaps and Secrets",
          "kubectl commands"
        ],
        resources: [
          { type: "video", title: "Kubernetes Tutorial for Beginners", url: "https://www.youtube.com/watch?v=X48VuDVv0do", platform: "YouTube" },
          { type: "interactive", title: "Kubernetes Playground", url: "https://labs.play-with-k8s.com/", platform: "Web" }
        ]
      },
      {
        phase: 2,
        title: "Deployments & Scaling",
        duration: "2 weeks",
        topics: [
          "Deployments",
          "StatefulSets",
          "DaemonSets",
          "Horizontal Pod Autoscaling"
        ],
        resources: [
          { type: "video", title: "Kubernetes Deployments", url: "https://www.youtube.com/watch?v=mNK14yXIZF4", platform: "YouTube" },
          { type: "course", title: "Kubernetes for Developers", url: "https://www.udemy.com/course/kubernetes-for-developers/", platform: "Udemy" }
        ]
      },
      {
        phase: 3,
        title: "Advanced Topics",
        duration: "3 weeks",
        topics: [
          "Ingress controllers",
          "Persistent volumes",
          "Helm charts",
          "Monitoring with Prometheus"
        ],
        resources: [
          { type: "video", title: "Kubernetes Advanced Tutorial", url: "https://www.youtube.com/watch?v=s_o8dwzRlu4", platform: "YouTube" },
          { type: "article", title: "Kubernetes Best Practices", url: "https://kubernetes.io/docs/concepts/configuration/overview/", platform: "Official" }
        ]
      }
    ],
    milestones: [
      "Deploy your first application",
      "Set up CI/CD with Kubernetes",
      "Implement auto-scaling",
      "Get CKA certification"
    ]
  },
  "Azure": {
    name: "Microsoft Azure",
    duration: "2-3 months",
    difficulty: "Intermediate",
    prerequisites: ["Cloud computing basics", "Networking"],
    phases: [
      {
        phase: 1,
        title: "Azure Fundamentals",
        duration: "2 weeks",
        topics: [
          "Azure Portal & CLI",
          "Resource Groups",
          "Virtual Machines",
          "Storage Accounts"
        ],
        resources: [
          { type: "video", title: "Azure Fundamentals", url: "https://www.youtube.com/watch?v=NKEFWyqJ5XA", platform: "YouTube" },
          { type: "course", title: "AZ-900 Certification", url: "https://learn.microsoft.com/en-us/certifications/azure-fundamentals/", platform: "Microsoft Learn" }
        ]
      },
      {
        phase: 2,
        title: "Azure Services",
        duration: "3 weeks",
        topics: [
          "App Services",
          "Azure Functions",
          "Cosmos DB",
          "Azure SQL"
        ],
        resources: [
          { type: "video", title: "Azure Services Overview", url: "https://www.youtube.com/watch?v=3gnLwqCd4Ek", platform: "YouTube" },
          { type: "course", title: "Azure Developer Course", url: "https://www.udemy.com/course/azure-tutorial/", platform: "Udemy" }
        ]
      },
      {
        phase: 3,
        title: "DevOps & Security",
        duration: "3 weeks",
        topics: [
          "Azure DevOps",
          "CI/CD Pipelines",
          "Azure Key Vault",
          "Identity & Access Management"
        ],
        resources: [
          { type: "video", title: "Azure DevOps Tutorial", url: "https://www.youtube.com/watch?v=4BibQ69MD8c", platform: "YouTube" },
          { type: "certification", title: "AZ-204 Certification", url: "https://learn.microsoft.com/en-us/certifications/azure-developer/", platform: "Microsoft" }
        ]
      }
    ],
    milestones: [
      "Pass AZ-900 certification",
      "Deploy a web app to Azure",
      "Set up CI/CD pipeline",
      "Implement Azure Functions"
    ]
  },
  "React": {
    name: "React.js",
    duration: "2 months",
    difficulty: "Intermediate",
    prerequisites: ["JavaScript", "HTML", "CSS"],
    phases: [
      {
        phase: 1,
        title: "React Basics",
        duration: "2 weeks",
        topics: [
          "JSX syntax",
          "Components & Props",
          "State & Lifecycle",
          "Event handling"
        ],
        resources: [
          { type: "video", title: "React Tutorial for Beginners", url: "https://www.youtube.com/watch?v=SqcY0GlETPk", platform: "YouTube" },
          { type: "interactive", title: "React Official Tutorial", url: "https://react.dev/learn", platform: "Official" }
        ]
      },
      {
        phase: 2,
        title: "Hooks & State Management",
        duration: "3 weeks",
        topics: [
          "useState, useEffect",
          "Custom Hooks",
          "Context API",
          "Redux Toolkit"
        ],
        resources: [
          { type: "video", title: "React Hooks Tutorial", url: "https://www.youtube.com/watch?v=TNhaISOUy6Q", platform: "YouTube" },
          { type: "course", title: "Complete React Course", url: "https://www.udemy.com/course/react-the-complete-guide/", platform: "Udemy" }
        ]
      },
      {
        phase: 3,
        title: "Advanced Topics",
        duration: "3 weeks",
        topics: [
          "React Router",
          "Performance optimization",
          "Testing with Jest",
          "Next.js framework"
        ],
        resources: [
          { type: "video", title: "Advanced React Patterns", url: "https://www.youtube.com/watch?v=xcZXS_VEJS0", platform: "YouTube" },
          { type: "project", title: "Build Real Projects", url: "https://github.com/topics/react-projects", platform: "GitHub" }
        ]
      }
    ],
    milestones: [
      "Build a todo app",
      "Create a weather dashboard",
      "Implement authentication",
      "Deploy to production"
    ]
  }
};

// Generic roadmap for any skill
function generateGenericRoadmap(skill: string) {
  return {
    name: skill,
    duration: "2-3 months",
    difficulty: "Intermediate",
    prerequisites: ["Programming basics"],
    phases: [
      {
        phase: 1,
        title: "Fundamentals",
        duration: "3 weeks",
        topics: [`${skill} basics`, "Core concepts", "Syntax and features", "Best practices"],
        resources: [
          { type: "video", title: `${skill} Tutorial for Beginners`, url: `https://www.youtube.com/results?search_query=${encodeURIComponent(skill + " tutorial")}`, platform: "YouTube" },
          { type: "article", title: `Learn ${skill}`, url: `https://www.google.com/search?q=learn+${encodeURIComponent(skill)}`, platform: "Google" }
        ]
      },
      {
        phase: 2,
        title: "Practical Application",
        duration: "4 weeks",
        topics: ["Real-world projects", "Common patterns", "Tools and libraries", "Integration"],
        resources: [
          { type: "course", title: `${skill} Course`, url: `https://www.udemy.com/courses/search/?q=${encodeURIComponent(skill)}`, platform: "Udemy" },
          { type: "practice", title: `${skill} Practice`, url: `https://www.google.com/search?q=${encodeURIComponent(skill + " practice problems")}`, platform: "Web" }
        ]
      },
      {
        phase: 3,
        title: "Advanced Topics",
        duration: "3 weeks",
        topics: ["Advanced features", "Performance optimization", "Security best practices", "Production deployment"],
        resources: [
          { type: "video", title: `Advanced ${skill}`, url: `https://www.youtube.com/results?search_query=advanced+${encodeURIComponent(skill)}`, platform: "YouTube" },
          { type: "project", title: `${skill} Projects`, url: `https://github.com/search?q=${encodeURIComponent(skill + " projects")}`, platform: "GitHub" }
        ]
      }
    ],
    milestones: [
      `Understand ${skill} fundamentals`,
      `Build 3 projects using ${skill}`,
      `Complete advanced tutorials`,
      `Contribute to open source`
    ]
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const skill = searchParams.get("skill");

    if (!skill) {
      return NextResponse.json(
        { error: "Skill parameter is required" },
        { status: 400 }
      );
    }

    // Check if we have a detailed roadmap for this skill
    const roadmap = skillRoadmaps[skill] || generateGenericRoadmap(skill);

    return NextResponse.json({
      success: true,
      roadmap
    });
  } catch (error) {
    console.error("Error fetching roadmap:", error);
    return NextResponse.json(
      { error: "Failed to fetch roadmap" },
      { status: 500 }
    );
  }
}
