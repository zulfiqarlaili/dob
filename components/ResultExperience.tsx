import {
  Button,
  Card,
  Collapse,
  Container,
  Grid,
  Image,
  Loading,
  Spacer,
  Text,
} from '@nextui-org/react';
import { useEffect, useMemo, useState } from 'react';
import { MdDownload, MdShare } from 'react-icons/md';
import { API_BASE_URL, AnalysisResponse, ChartExplanation } from '@/lib/api';
import { displayDob, encodeDob } from '@/lib/dob';
import { SavedReading, saveReading } from '@/lib/storage';

type ResultExperienceProps = {
  dob: string;
  onSaved?: (readings: SavedReading[]) => void;
};

function wrapText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = text.split(' ');
  let line = '';
  let currentY = y;

  words.forEach((word) => {
    const testLine = `${line}${word} `;
    if (context.measureText(testLine).width > maxWidth && line) {
      context.fillText(line, x, currentY);
      line = `${word} `;
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  });

  context.fillText(line, x, currentY);
  return currentY + lineHeight;
}

export default function ResultExperience({ dob, onSaved }: ResultExperienceProps) {
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [image, setImage] = useState('');
  const [activeExplanation, setActiveExplanation] = useState<ChartExplanation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shareStatus, setShareStatus] = useState('');

  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}/result?d=${encodeDob(dob)}`;
  }, [dob]);

  useEffect(() => {
    let imageUrl = '';
    setLoading(true);
    setError('');
    setAnalysis(null);
    setImage('');

    Promise.all([
      fetch(`${API_BASE_URL}/analysis/${dob}`).then((response) => {
        if (!response.ok) throw new Error('Unable to load your reading.');
        return response.json();
      }),
      fetch(`${API_BASE_URL}/result/${dob}`).then((response) => {
        if (!response.ok) throw new Error('Unable to generate your chart.');
        return response.blob();
      }),
    ])
      .then(([analysisJson, imageBlob]: [AnalysisResponse, Blob]) => {
        imageUrl = URL.createObjectURL(imageBlob);
        setAnalysis(analysisJson);
        setActiveExplanation(analysisJson.chart_explanations[0] || null);
        setImage(imageUrl);
        onSaved?.(saveReading(analysisJson));
      })
      .catch((fetchError: Error) => {
        setError(fetchError.message);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [dob, onSaved]);

  async function copyShareLink() {
    if (!shareUrl) return;

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareUrl);
      setShareStatus('Share link copied.');
    } else {
      setShareStatus(shareUrl);
    }
  }

  function downloadCard() {
    if (!analysis || !image) return;

    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const context = canvas.getContext('2d');
    if (!context) return;

    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#111827';
    context.font = '700 64px Arial';
    context.fillText('Borndate Reading', 80, 130);
    context.font = '400 38px Arial';
    context.fillStyle = '#4b5563';
    context.fillText(displayDob(analysis.dob), 80, 190);

    const chart = new window.Image();
    chart.onload = () => {
      context.drawImage(chart, 140, 250, 800, 800);
      context.fillStyle = '#111827';
      context.font = '700 48px Arial';
      context.fillText(analysis.personal_reading.headline, 80, 1160, 920);
      context.font = '400 34px Arial';
      context.fillStyle = '#374151';
      const nextY = wrapText(
        context,
        analysis.personal_reading.summary,
        80,
        1230,
        920,
        48,
      );
      context.fillStyle = '#7c3aed';
      context.font = '700 36px Arial';
      wrapText(context, analysis.weekly_insight.message, 80, nextY + 40, 920, 46);
      context.fillStyle = '#111827';
      context.font = '700 32px Arial';
      context.fillText('borndate.web.app', 80, 1820);

      const link = document.createElement('a');
      link.download = `borndate-${analysis.dob}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    chart.src = image;
  }

  if (loading) {
    return (
      <Container display='flex' justify='center' alignItems='center' css={{ minHeight: 260 }}>
        <Loading type='points-opacity' color='secondary' />
      </Container>
    );
  }

  if (error) {
    return (
      <Card variant='bordered'>
        <Card.Body>
          <Text color='error' b>
            {error}
          </Text>
        </Card.Body>
      </Card>
    );
  }

  if (!analysis) return null;
  const primaryElement = analysis.dominant_elements[0];

  return (
    <Container css={{ paddingLeft: '$0', paddingRight: '$0' }}>
      <Text h2 size={30} css={{ textAlign: 'center' }}>
        Your result
      </Text>
      <Text color='gray' css={{ textAlign: 'center' }}>
        {displayDob(analysis.dob)}
      </Text>
      <Spacer y={1} />

      {image && <Image src={image} alt='Generated numerology chart' />}

      <Spacer y={1} />
      <Grid.Container gap={1} justify='center'>
        <Grid>
          <Button auto icon={<MdShare />} color='gradient' onPress={copyShareLink}>
            Share
          </Button>
        </Grid>
        <Grid>
          <Button auto icon={<MdDownload />} bordered color='secondary' onPress={downloadCard}>
            Card
          </Button>
        </Grid>
        {shareStatus && (
          <Grid xs={12}>
            <Text size='$sm' color='gray' css={{ textAlign: 'center', width: '100%' }}>
              {shareStatus}
            </Text>
          </Grid>
        )}
      </Grid.Container>

      <Spacer y={2} />
      <Text h3 size={26}>
        About You
      </Text>
      <Card variant='bordered'>
        <Card.Body>
          <Text b>{analysis.personal_reading.headline}</Text>
          <Text>{analysis.personal_reading.summary}</Text>
          <Spacer y={0.5} />
          <Text b>Practical focus</Text>
          <Text>{analysis.personal_reading.today}</Text>
        </Card.Body>
      </Card>

      <Spacer y={2} />
      <Text h3 size={26}>
        Understand Your Chart
      </Text>
      <Grid.Container gap={1}>
        {analysis.chart_explanations.map((item) => (
          <Grid key={item.key}>
            <Button
              auto
              light={activeExplanation?.key !== item.key}
              color='secondary'
              onPress={() => setActiveExplanation(item)}
            >
              {item.title}
            </Button>
          </Grid>
        ))}
      </Grid.Container>
      {activeExplanation && (
        <>
          <Spacer y={0.7} />
          <Card variant='bordered'>
            <Card.Body>
              <Text b>
                {activeExplanation.title}
                {activeExplanation.number ? ` ${activeExplanation.number}` : ''}
              </Text>
              <Text color='gray'>{activeExplanation.description}</Text>
              <Text>{activeExplanation.meaning}</Text>
              {activeExplanation.key === 'dominant' && primaryElement && (
                <Text color='secondary' b>
                  Dominance count: {primaryElement.count}
                </Text>
              )}
            </Card.Body>
          </Card>
        </>
      )}

      <Spacer y={2} />
      <Text h3 size={26}>
        Element of Dominance
      </Text>
      <Collapse.Group splitted css={{ paddingLeft: '$0', paddingRight: '$0' }}>
        {analysis.dominant_elements.map((element) => (
          <Collapse
            key={element.name}
            title={
              <Text css={{ fontSize: '$xl', fontWeight: '$bold', color: element.color }}>
                {element.name} · {element.count}
              </Text>
            }
            subtitle={`Dominance count ${element.count} · ${element.personality}`}
          >
            <Text b>Dominance Count</Text>
            <Text>
              {element.name} appears {element.count} times in this chart, which shows
              how strongly it stands out in this reading.
            </Text>
            <Spacer y={0.7} />
            <Text b>Strength & Weakness</Text>
            <Text>{element.strength_and_weakness}</Text>
            <Spacer y={0.7} />
            <Text b>Relationship</Text>
            <Text>{element.relationship}</Text>
            <Spacer y={0.7} />
            <Text b>Compatibility</Text>
            <Text>{element.compatibility}</Text>
            <Spacer y={0.7} />
            <Text b>Advice</Text>
            <Text>{element.advice}</Text>
          </Collapse>
        ))}
      </Collapse.Group>

      <Spacer y={2} />
      <Card variant='bordered'>
        <Card.Body>
          <Text b>{analysis.weekly_insight.title}</Text>
          <Text>{analysis.weekly_insight.message}</Text>
        </Card.Body>
      </Card>
    </Container>
  );
}
