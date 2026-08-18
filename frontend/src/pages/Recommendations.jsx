import {
  AlertTriangle,
  ShieldCheck,
  VolumeX,
  Camera,
  Route,
  Moon,
  HeartPulse,
  Ban,
} from 'lucide-react';

import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardBody } from '../components/ui/Card';

const recommendations = [
  {
    icon: ShieldCheck,
    title: 'Maintain a safe distance',
    description:
      'Avoid approaching recently detected wildlife. Observe animals from a safe distance and allow them enough space to move freely.',
  },
  {
    icon: AlertTriangle,
    title: 'Do not approach predators',
    description:
      'Avoid approaching or intentionally disturbing predators such as lions and other potentially dangerous wildlife.',
  },
  {
    icon: Ban,
    title: 'Do not feed wildlife',
    description:
      'Never feed or intentionally attract wild animals. Feeding can alter natural behaviour and increase human-wildlife conflict.',
  },
  {
    icon: VolumeX,
    title: 'Minimize disturbance',
    description:
      'Keep noise and sudden movements to a minimum when wildlife is detected nearby.',
  },
  {
    icon: Camera,
    title: 'Prefer remote observation',
    description:
      'Use camera traps, audio monitoring, and other remote methods whenever possible instead of approaching animals.',
  },
  {
    icon: Route,
    title: 'Keep escape routes clear',
    description:
      'Never corner, surround, or block the movement path of a wild animal. Give animals a clear route to move away.',
  },
  {
    icon: Moon,
    title: 'Exercise caution at night',
    description:
      'Take additional care in areas with recent wildlife activity, especially during low-light conditions.',
  },
  {
    icon: HeartPulse,
    title: 'Do not handle injured wildlife',
    description:
      'Avoid touching or handling injured or distressed animals. Contact authorized wildlife personnel when assistance is required.',
  },
];

export default function Recommendations() {
  return (
    <>
      <PageHeader
        eyebrow="Field guidance"
        title="Wildlife recommendations"
        description="Practical safety guidance for observing and monitoring wildlife responsibly."
      />

      <div className="space-y-6">

        <Card>
          <CardBody>
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-clay-50">
                <AlertTriangle size={21} className="text-clay-700" />
              </div>

              <div>
                <h2 className="font-medium text-ink-900">
                  Wildlife safety first
                </h2>

                <p className="mt-1 text-sm leading-6 text-ink-600">
                  Wildlife detections support monitoring and awareness.
                  Do not use model predictions as a reason to approach,
                  disturb, or interact with wild animals.
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        <div className="grid gap-5 md:grid-cols-2">
          {recommendations.map((item) => {
            const Icon = item.icon;

            return (
              <Card key={item.title}>
                <CardBody>
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sage-50">
                      <Icon size={19} className="text-sage-700" />
                    </div>

                    <div>
                      <h3 className="font-medium text-ink-900">
                        {item.title}
                      </h3>

                      <p className="mt-1.5 text-sm leading-6 text-ink-600">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>

        <Card>
          <CardBody>
            <div className="flex items-start gap-3">
              <ShieldCheck
                size={18}
                className="mt-0.5 shrink-0 text-sage-700"
              />

              <p className="text-sm leading-6 text-ink-600">
                <span className="font-medium text-ink-900">
                  Monitoring reminder:
                </span>{' '}
                Detection results are model estimates. Confirm important
                wildlife records with appropriate field evidence before
                taking action.
              </p>
            </div>
          </CardBody>
        </Card>

      </div>
    </>
  );
}