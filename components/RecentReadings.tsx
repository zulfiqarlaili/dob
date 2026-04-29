import { Button, Card, Grid, Spacer, Text } from '@nextui-org/react';
import { MdDeleteOutline, MdOpenInNew } from 'react-icons/md';
import { displayDob } from '@/lib/dob';
import { SavedReading, deleteSavedReading } from '@/lib/storage';

type RecentReadingsProps = {
  readings: SavedReading[];
  onOpen: (dob: string) => void;
  onChange: (readings: SavedReading[]) => void;
};

export default function RecentReadings({ readings, onOpen, onChange }: RecentReadingsProps) {
  if (readings.length === 0) return null;

  return (
    <>
      <Text h3 size={26} css={{ textAlign: 'center' }}>
        Recent readings
      </Text>
      <Spacer y={0.5} />
      <Grid.Container gap={1} justify='center'>
        {readings.map((reading) => (
          <Grid xs={12} sm={6} key={reading.dob}>
            <Card variant='bordered'>
              <Card.Body>
                <Text b>{displayDob(reading.dob)}</Text>
                <Text size='$sm' color='gray'>
                  {reading.dominantElement} energy
                </Text>
                <Text size='$sm'>{reading.insight}</Text>
                <Spacer y={0.7} />
                <Grid.Container gap={1}>
                  <Grid>
                    <Button
                      auto
                      size='sm'
                      color='secondary'
                      icon={<MdOpenInNew />}
                      onPress={() => onOpen(reading.dob)}
                    >
                      Open
                    </Button>
                  </Grid>
                  <Grid>
                    <Button
                      auto
                      size='sm'
                      light
                      color='error'
                      icon={<MdDeleteOutline />}
                      onPress={() => onChange(deleteSavedReading(reading.dob))}
                    >
                      Remove
                    </Button>
                  </Grid>
                </Grid.Container>
              </Card.Body>
            </Card>
          </Grid>
        ))}
      </Grid.Container>
    </>
  );
}
