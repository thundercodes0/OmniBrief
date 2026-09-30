import { apiClient } from '../client/src/services/apiClient';
import fs from 'fs';
import path from 'path';

async function testApiClient() {
  console.log('🧪 Testing apiClient directly against live servers...\n');

  // 1. Health check
  console.log('1. Testing apiClient.checkHealth()...');
  const health = await apiClient.checkHealth();
  console.log('   Health result:', health);
  if (!health.ok) {
    throw new Error(`apiClient.checkHealth failed: ${health.error}`);
  }
  console.log('   ✅ Health check verified!\n');

  // 2. Ingest raw text
  console.log('2. Testing apiClient.ingestSource(rawText)...');
  const sampleText = "India's digital public infrastructure has expanded significantly in recent years. The source document discusses the role of interoperable digital systems in improving access to public services. It highlights the importance of secure data exchange, scalable infrastructure, and user-centric design.";
  const textResult = await apiClient.ingestSource({
    rawText: sampleText,
    contextInstructions: 'Enterprise summary',
  });
  console.log('   Ingest result success:', textResult.success);
  console.log('   Ingested sourceType:', textResult.source?.sourceType);
  console.log('   Ingested title:', textResult.source?.title);
  if (!textResult.success || textResult.source?.sourceType !== 'text') {
    throw new Error(`Ingest raw text failed: ${JSON.stringify(textResult.error)}`);
  }
  console.log('   ✅ Raw text ingestion verified!\n');

  // 3. Ingest PDF file
  console.log('3. Testing apiClient.ingestSource(PDF file)...');
  const pdfBuffer = fs.readFileSync(path.join(__dirname, 'sample.pdf'));
  const fileBlob = new Blob([pdfBuffer], { type: 'application/pdf' });
  const mockFile = new File([fileBlob], 'sample.pdf', { type: 'application/pdf' });

  const pdfResult = await apiClient.ingestSource({
    file: mockFile,
    contextInstructions: 'Advisory analysis',
  });
  console.log('   PDF ingest success:', pdfResult.success);
  console.log('   PDF sourceType:', pdfResult.source?.sourceType);
  console.log('   PDF title:', pdfResult.source?.title);
  console.log('   PDF extracted text:', pdfResult.source?.text);
  if (!pdfResult.success || pdfResult.source?.sourceType !== 'pdf') {
    throw new Error(`Ingest PDF failed: ${JSON.stringify(pdfResult.error)}`);
  }
  console.log('   ✅ PDF ingestion verified!\n');

  // 4. Brief generation
  console.log('4. Testing apiClient.generateBrief()...');
  const briefResult = await apiClient.generateBrief({
    sourceContent: sampleText,
    configuration: {
      targetAudience: 'Executive Leadership',
      tone: 'formal',
      language: 'en',
      detailLevel: 'Standard (Balanced)',
      communicationObjective: 'Strategic overview',
    },
  });
  console.log('   Brief result success:', briefResult.success);
  console.log('   Brief error code:', briefResult.error?.code);
  console.log('   Brief error message:', briefResult.error?.message);
  if (briefResult.success) {
    console.log('   ✅ Source brief successfully generated live by Gemini!');
  } else if (briefResult.error?.code === 'API_KEY_ERROR') {
    console.log('   ✅ Error correctly classified as API_KEY_ERROR without masking or network crash!');
  } else {
    throw new Error(`Unexpected brief result: ${JSON.stringify(briefResult.error)}`);
  }

  console.log('\n🎉 ALL apiClient tests PASSED successfully!');
}

testApiClient().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
