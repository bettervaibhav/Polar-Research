import { AIProvider, GenerateLessonParams, GroundedQuestionParams, GenerateMediaParams } from './ai-provider';
import { GroundedAnswer, SourceCitation } from '@/types';
import { Lesson, LessonSection, BlackboardAction, QuizQuestion } from '@/types/lesson';
import { GeneratedContentItem, ContentType } from '@/types/media';

export class DemoProvider implements AIProvider {
  public name = 'DemoProvider (Deterministic Grounded Polar AI)';

  public isAvailable(): boolean {
    return true;
  }

  public async generateText(prompt: string, systemPrompt?: string): Promise<string> {
    return `[Demo Mode Analysis]\nBased on polar scientific datasets, your query regarding "${prompt.slice(0, 50)}..." relates to Arctic/Antarctic teleconnections and cryospheric equilibrium.`;
  }

  public async answerGroundedQuestion(params: GroundedQuestionParams): Promise<GroundedAnswer> {
    const startTime = Date.now();
    const { query, contextChunks } = params;

    if (!contextChunks || contextChunks.length === 0) {
      return {
        answer: 'I could not find enough verified research data in the Polar Sense knowledge repository to answer this question with scientific confidence.',
        citations: [],
        confidenceScore: 0.2,
        model: 'DemoProvider-Deterministic-v1',
        retrievedCount: 0,
        latencyMs: Date.now() - startTime,
      };
    }

    const topChunks = contextChunks.slice(0, 3);
    const citations: SourceCitation[] = topChunks.map((c) => ({
      sourceId: c.docId,
      title: c.docTitle,
      page: c.pageNumber,
      section: c.sectionTitle,
      snippet: c.content,
      relevanceScore: Math.round(c.score * 100) / 100,
    }));

    // Synthesize grounded explanation directly from retrieved chunk content
    const primarySnippet = topChunks[0].content;
    const secondarySnippet = topChunks[1] ? topChunks[1].content : '';

    let answer = `According to verified observations documented in **${topChunks[0].docTitle}**:\n\n`;
    answer += `${primarySnippet}\n\n`;

    if (secondarySnippet) {
      answer += `Furthermore, as detailed in *${topChunks[1].sectionTitle}*:\n`;
      answer += `"${secondarySnippet.slice(0, 200)}..."\n\n`;
    }

    answer += `This confirms that empirical measurements from our polar research stations corroborate this finding under Antarctic/Arctic field conditions.`;

    return {
      answer,
      citations,
      confidenceScore: Math.min(0.96, Math.max(0.75, topChunks[0].score)),
      model: 'DemoProvider-Deterministic-v1',
      retrievedCount: contextChunks.length,
      latencyMs: Date.now() - startTime,
    };
  }

  public async generateLesson(params: GenerateLessonParams): Promise<Lesson> {
    const { topic, learnerLevel, targetDurationMin, learningObjective, sourceDocumentIds } = params;
    const lessonId = `les-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    // Build structured sections based on topic
    const isArctic = topic.toLowerCase().includes('arctic') || topic.toLowerCase().includes('indarc') || topic.toLowerCase().includes('monsoon');
    const isAlbedo = topic.toLowerCase().includes('albedo') || topic.toLowerCase().includes('sea ice');
    const isLimnology = topic.toLowerCase().includes('lake') || topic.toLowerCase().includes('maitri') || topic.toLowerCase().includes('priyadarshini');

    let title = `${topic} — Fundamentals & Observational Science`;
    let objectives = [
      `Analyze the core physical and thermodynamic principles of ${topic}.`,
      `Examine empirical datasets collected at Indian polar research stations.`,
      `Evaluate regional and global climate feedbacks stemming from polar processes.`,
    ];

    if (learningObjective) {
      objectives.unshift(learningObjective);
    }

    const sections: LessonSection[] = [];

    if (isAlbedo) {
      title = 'Antarctic Sea Ice Dynamics & The Ice-Albedo Feedback Loop';
      sections.push(
        {
          id: `${lessonId}-sec-1`,
          orderIndex: 0,
          title: 'Introduction to Antarctic Fast Ice',
          concept: 'Sea ice functions as a critical thermodynamic barrier between the polar atmosphere and the Southern Ocean.',
          teacherScript: 'Welcome everyone. Today we are exploring Antarctic fast ice and how its surface reflectivity regulates Earth\'s planetary energy balance.',
          estimatedDurationSec: 60,
          blackboardActions: [
            {
              id: `${lessonId}-act-1`,
              actionType: 'WRITE_TEXT',
              orderIndex: 0,
              payload: { x: 50, y: 70, text: 'ANTARCTIC SEA ICE THERMODYNAMICS', size: 22, color: '#00f2fe', weight: 'bold' },
              spokenTriggerPhrase: 'Antarctic fast ice',
            },
            {
              id: `${lessonId}-act-2`,
              actionType: 'DRAW_BOX',
              orderIndex: 1,
              payload: { x: 40, y: 110, width: 340, height: 120, label: 'Fast Ice (Prydz Bay / Bharati Station)', color: '#38bdf8' },
              spokenTriggerPhrase: 'thermodynamic barrier',
            },
            {
              id: `${lessonId}-act-3`,
              actionType: 'WRITE_TEXT',
              orderIndex: 2,
              payload: { x: 60, y: 160, text: '• Peak Thickness: 1.6 - 2.1 meters\n• Active Months: April to November\n• Base Temp: -1.8°C Freezing Point', size: 15, color: '#f8fafc' },
              spokenTriggerPhrase: 'energy balance',
            },
          ],
          expectedQuestions: ['Why is it called fast ice?', 'How thick does the ice grow at Bharati?'],
          sourceCitations: ['doc-antarctic-ice-albedo:Sec 1'],
        },
        {
          id: `${lessonId}-sec-2`,
          orderIndex: 1,
          title: 'The Ice-Albedo Feedback Mechanism',
          concept: 'High-albedo snow reflects solar energy; summer melt ponds drop albedo to 0.48, accelerating ocean heat absorption.',
          teacherScript: 'Let us now look at the blackboard to trace the positive feedback cycle when snow begins to metamorphose in summer.',
          estimatedDurationSec: 90,
          blackboardActions: [
            {
              id: `${lessonId}-act-4`,
              actionType: 'WRITE_TEXT',
              orderIndex: 0,
              payload: { x: 420, y: 70, text: 'THE ALBEDO FEEDBACK LOOP', size: 22, color: '#facc15', weight: 'bold' },
              spokenTriggerPhrase: 'feedback cycle',
            },
            {
              id: `${lessonId}-act-5`,
              actionType: 'DRAW_BOX',
              orderIndex: 1,
              payload: { x: 420, y: 110, width: 170, height: 60, label: 'Fresh Snow (Albedo 0.84)', color: '#86efac' },
            },
            {
              id: `${lessonId}-act-6`,
              actionType: 'DRAW_ARROW',
              orderIndex: 2,
              payload: { from: { x: 505, y: 170 }, to: { x: 505, y: 220 }, label: 'Summer Solar Flux' },
            },
            {
              id: `${lessonId}-act-7`,
              actionType: 'DRAW_BOX',
              orderIndex: 3,
              payload: { x: 420, y: 220, width: 170, height: 60, label: 'Melt Ponds (Albedo 0.48)', color: '#f87171' },
            },
            {
              id: `${lessonId}-act-8`,
              actionType: 'DRAW_ARROW',
              orderIndex: 4,
              payload: { from: { x: 590, y: 250 }, to: { x: 670, y: 250 }, label: '52% Solar Absorbed' },
            },
            {
              id: `${lessonId}-act-9`,
              actionType: 'DRAW_BOX',
              orderIndex: 5,
              payload: { x: 670, y: 220, width: 180, height: 60, label: 'Bottom Melt (>3.4 cm/day)', color: '#f43f5e' },
            },
          ],
          expectedQuestions: ['What is the albedo of open ocean water?', 'Can this feedback loop be reversed?'],
          sourceCitations: ['doc-antarctic-ice-albedo:Sec 3'],
        },
        {
          id: `${lessonId}-sec-3`,
          orderIndex: 2,
          title: 'Global Climate & Southern Ocean Implications',
          concept: 'The transition from sea ice to open seawater amplifies ocean heat absorption by an order of magnitude.',
          teacherScript: 'Finally, notice that open seawater has an albedo of only 0.06. This means 94% of solar energy is trapped in the ocean when ice retreats.',
          estimatedDurationSec: 60,
          blackboardActions: [
            {
              id: `${lessonId}-act-10`,
              actionType: 'WRITE_TEXT',
              orderIndex: 0,
              payload: { x: 50, y: 320, text: 'CLIMATIC SUMMARY: 0.84 (Snow) vs 0.06 (Ocean)', size: 18, color: '#c084fc', weight: 'bold' },
            },
            {
              id: `${lessonId}-act-11`,
              actionType: 'HIGHLIGHT',
              orderIndex: 1,
              payload: { targetActionId: `${lessonId}-act-9`, color: 'rgba(234, 179, 8, 0.3)' },
            },
          ],
          expectedQuestions: ['How does Bharati station measure this?'],
          sourceCitations: ['doc-antarctic-ice-albedo:Sec 4'],
        }
      );
    } else {
      // Default structured polar lesson
      sections.push(
        {
          id: `${lessonId}-sec-1`,
          orderIndex: 0,
          title: `Core Principles of ${topic}`,
          concept: `Foundational physical and ecological processes governing ${topic}.`,
          teacherScript: `Hello and welcome to this session on ${topic}. Let us unpack the key scientific mechanisms documented by polar researchers.`,
          estimatedDurationSec: 75,
          blackboardActions: [
            {
              id: `${lessonId}-act-1`,
              actionType: 'WRITE_TEXT',
              orderIndex: 0,
              payload: { x: 60, y: 70, text: topic.toUpperCase(), size: 22, color: '#00f2fe', weight: 'bold' },
            },
            {
              id: `${lessonId}-act-2`,
              actionType: 'DRAW_BOX',
              orderIndex: 1,
              payload: { x: 50, y: 120, width: 320, height: 100, label: 'Observational Baseline', color: '#38bdf8' },
            },
            {
              id: `${lessonId}-act-3`,
              actionType: 'WRITE_TEXT',
              orderIndex: 2,
              payload: { x: 70, y: 160, text: '• In-situ telemetry & core sampling\n• Remote sensing & satellite radar', size: 15, color: '#f8fafc' },
            },
          ],
          expectedQuestions: ['What are the main instruments used?', 'Where was this measured?'],
          sourceCitations: ['doc-antarctic-ice-albedo', 'doc-indarc-arctic-monsoon'],
        },
        {
          id: `${lessonId}-sec-2`,
          orderIndex: 1,
          title: 'Mechanism & Observational Data',
          concept: 'Empirical data reveals deep couplings across polar environmental boundaries.',
          teacherScript: 'On the board, observe the direct cause-and-effect relationship between temperature gradients and environmental equilibrium.',
          estimatedDurationSec: 90,
          blackboardActions: [
            {
              id: `${lessonId}-act-4`,
              actionType: 'WRITE_TEXT',
              orderIndex: 0,
              payload: { x: 420, y: 70, text: 'MECHANISTIC COUPLING', size: 20, color: '#facc15', weight: 'bold' },
            },
            {
              id: `${lessonId}-act-5`,
              actionType: 'DRAW_BOX',
              orderIndex: 1,
              payload: { x: 420, y: 120, width: 180, height: 60, label: 'Primary Forcing', color: '#86efac' },
            },
            {
              id: `${lessonId}-act-6`,
              actionType: 'DRAW_ARROW',
              orderIndex: 2,
              payload: { from: { x: 510, y: 180 }, to: { x: 510, y: 240 }, label: 'Coupled Response' },
            },
            {
              id: `${lessonId}-act-7`,
              actionType: 'DRAW_BOX',
              orderIndex: 3,
              payload: { x: 420, y: 240, width: 180, height: 60, label: 'Global Climate State', color: '#f87171' },
            },
          ],
          expectedQuestions: ['How does this affect low-latitude weather?'],
          sourceCitations: ['doc-indarc-arctic-monsoon:Sec 3'],
        }
      );
    }

    const quiz: QuizQuestion[] = [
      {
        id: `${lessonId}-q1`,
        question: `What is the primary factor driving the positive feedback in ${topic}?`,
        options: [
          'Decreased solar reflectance upon surface melting',
          'Increased atmospheric nitrogen concentration',
          'Subsurface tectonic plate subduction',
          'Geothermal heat release from volcanic vents',
        ],
        correctAnswerIndex: 0,
        explanation: 'When ice or snow melts into ponds or open water, albedo drops sharply from ~0.84 to ~0.48/0.06, absorbing far more incoming solar radiation.',
        sourceReference: 'doc-antarctic-ice-albedo',
      },
      {
        id: `${lessonId}-q2`,
        question: 'Which Indian research station conducts year-round in-situ atmospheric and fast ice profiling in East Antarctica?',
        options: ['Bharati Station (Larsemann Hills)', 'Himadri Station (Ny-Ålesund)', 'IndARC Mooring', 'Dakshin Gangotri'],
        correctAnswerIndex: 0,
        explanation: 'Bharati Station in the Larsemann Hills operates continuous pyranometer, aerosol lidar, and fast-ice monitoring stations.',
        sourceReference: 'doc-antarctic-ice-albedo',
      },
    ];

    return {
      id: lessonId,
      title,
      topic,
      learnerLevel,
      targetDurationMin,
      learningObjectives: objectives,
      summary: `A comprehensive ${targetDurationMin}-minute interactive lesson analyzing ${topic}, backed by observations from Indian and international polar stations.`,
      sections,
      quiz,
      sourceDocumentIds: sourceDocumentIds || ['doc-antarctic-ice-albedo'],
      createdAt: new Date().toISOString(),
    };
  }

  public async generateMediaContent(params: GenerateMediaParams): Promise<GeneratedContentItem[]> {
    const { topic, sourceDocuments, targetFormats } = params;
    const items: GeneratedContentItem[] = [];
    const sourceIds = sourceDocuments.map((d) => d.id);
    const sourceTitles = sourceDocuments.map((d) => d.title);

    for (const fmt of targetFormats) {
      const id = `med-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      let data: any;

      if (fmt === 'web_article') {
        data = {
          headline: `Unlocking the Frozen Mirror: How ${topic} Shapes Earth's Climate`,
          subheadline: `Groundbreaking observational science from Indian polar research stations reveals the hidden thermodynamics of polar ecosystems.`,
          readingTimeMin: 4,
          body: `Deep in the polar extremes, Earth's cryosphere acts as a delicate planetary thermostat. Recent findings documented by scientists at Bharati and Himadri stations illuminate how subtle shifts in sea ice albedo and ocean circulation cascade into worldwide climate rhythms.\n\nFrom fresh dry snow reflecting 84% of solar energy to rapid summer melt pond formation, polar scientists are piecing together high-resolution records essential for forecasting global weather patterns and safeguarding coastal infrastructure.`,
          keyTakeaways: [
            'Fresh polar snow reflects up to 84% of incoming solar energy.',
            'Melt ponds absorb over 52% of sunlight, triggering accelerated bottom melting.',
            'Polar observations directly inform long-range monsoon and climate predictions.',
          ],
        };
      } else if (fmt === 'social_thread') {
        data = {
          platform: 'twitter',
          hook: `❄️ Did you know Antarctica has an invisible mirror that reflects 84% of solar heat? Here is what scientists at India's Bharati Station discovered: 🧵👇`,
          posts: [
            `1/4 Fresh snow over Antarctic sea ice has an albedo of 0.84. But in mid-summer, melt ponds form and albedo plunges to 0.48, trapping massive solar heat. #PolarScience #ClimateAction`,
            `2/4 This triggers a positive feedback loop: more heat absorption = faster bottom melt at rates exceeding 3.4 cm/day! 🌊🧊`,
            `3/4 Indian scientists at Bharati (Larsemann Hills) and IndARC (Kongsfjorden) track these changes year-round to model global weather teleconnections. 🇮🇳🔬`,
            `4/4 Read the full research and explore our AI Teaching Room at Polar Sense AI: [link] #EarthScience #PolarResearch`,
          ],
          hashtags: ['#PolarScience', '#Antarctica', '#ClimateResearch', '#NCPOR', '#EarthScience'],
        };
      } else if (fmt === 'video_script') {
        data = {
          title: `The Giant Polar Heat Mirror (60s Science Short)`,
          targetDurationSec: 60,
          scenes: [
            {
              timecode: '0:00 - 0:12',
              visualDescription: 'Cinematic drone shot flying over snow-covered fast ice near Bharati Station.',
              audioNarration: 'Imagine a mirror so massive it cools the entire planet. That is Antarctica\'s sea ice.',
              onScreenText: 'Earth\'s Giant Solar Mirror ❄️',
              soundEffectCue: 'Wind whistling with subtle synth swell',
            },
            {
              timecode: '0:12 - 0:30',
              visualDescription: 'Split screen comparing bright white snow (84% reflection) and blue melt ponds (absorbing heat).',
              audioNarration: 'When fresh, it reflects 84% of solar heat back into space. But when summer melt begins, reflective power drops by half.',
              onScreenText: 'Albedo: 0.84 (Snow) ➡️ 0.48 (Melt Pond)',
              soundEffectCue: 'Transition whoosh',
            },
            {
              timecode: '0:30 - 0:48',
              visualDescription: 'Animated infographic showing ocean warming and accelerated ice sheet thinning.',
              audioNarration: 'This extra heat accelerates ice loss by over 3 centimeters a day, shifting deep ocean currents across the globe.',
              onScreenText: '3.4 cm / day Bottom Melt Rate 📉',
              soundEffectCue: 'Deep bass thud',
            },
            {
              timecode: '0:48 - 1:00',
              visualDescription: 'Indian scientist at Bharati station adjusting solar sensor; Polar Sense AI logo.',
              audioNarration: 'Explore the full grounded research and step into our AI Teaching Room on Polar Sense AI.',
              onScreenText: 'Explore on Polar Sense AI 🌐',
              soundEffectCue: 'Uplifting chime',
            },
          ],
          callToAction: 'Step into the AI Teaching Room to interact with the teacher and digital blackboard!',
        };
      } else if (fmt === 'executive_brief') {
        data = {
          policyTitle: `Strategic Policy Brief: Polar Cryosphere Resilience & Teleconnection Risks`,
          strategicContext: `Empirical observations from NCPOR Arctic and Antarctic installations demonstrate non-linear ice-ocean responses impacting Indian climatic stability.`,
          keyFindings: [
            'Polar amplification accelerates albedo degradation in coastal fast ice.',
            'Arctic oceanographic warming strongly correlates with Indian summer monsoon rainfall disruption.',
            'Sustained multi-depth mooring infrastructure (e.g. IndARC) is critical for strategic national weather security.',
          ],
          policyImplications: [
            'Expand budgetary allocations for year-round polar sensor automation.',
            'Integrate polar teleconnection telemetry into national disaster management frameworks.',
          ],
          scientificConfidence: 'High (Verified across multiple observational field campaigns)',
        };
      } else {
        data = {
          title: `Visual Infographic: The Polar Energy Balance`,
          visualTheme: 'Arctic Ice & Neon Aurora',
          keyMetrics: [
            { label: 'Fresh Snow Albedo', value: '84%', unit: 'Solar Reflectance' },
            { label: 'Melt Pond Albedo', value: '48%', unit: 'Solar Reflectance' },
            { label: 'Open Seawater Albedo', value: '6%', unit: 'Solar Reflectance' },
            { label: 'Bottom Melt Rate', value: '3.4', unit: 'cm / day' },
          ],
          flowchartNodes: [
            { id: 'n1', label: 'Solar Irradiance', subtext: 'Incoming 300-2500nm flux' },
            { id: 'n2', label: 'Snow Grain Growth', subtext: '80µm to >400µm metamorphosis' },
            { id: 'n3', label: 'Melt Inception', subtext: 'Ponding absorbs 52% energy' },
            { id: 'n4', label: 'Ocean Heat Storage', subtext: 'Cascades into deep water' },
          ],
          colorPalette: ['#00f2fe', '#38bdf8', '#86efac', '#facc15', '#f87171'],
        };
      }

      items.push({
        id,
        contentType: fmt,
        title: `${fmt.replace('_', ' ').toUpperCase()}: ${topic}`,
        data,
        sourceDocumentIds: sourceIds,
        sourceTitles,
        modelUsed: 'DemoProvider-Deterministic-v1',
        status: 'approved',
        createdAt: new Date().toISOString(),
      });
    }

    return items;
  }
}
