const assert = require('assert');
require('dotenv').config();

const BASE_URL = `http://localhost:${process.env.PORT || 5000}`;

async function runTests() {
  console.log('--- Starting API Verification Tests ---');

  try {
    // 1. Health check
    console.log('\nTesting GET /health...');
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthData = await healthRes.json();
    assert.strictEqual(healthRes.status, 200);
    assert.strictEqual(healthData.status, 'OK');
    console.log('✓ Health check passed');

    // 2. Clear out any previous test task if any (by running GET first)
    console.log('\nTesting GET /tasks...');
    const getRes = await fetch(`${BASE_URL}/tasks`);
    const tasks = await getRes.json();
    assert.strictEqual(getRes.status, 200);
    assert(Array.isArray(tasks));
    console.log(`✓ GET /tasks passed (returned ${tasks.length} tasks)`);

    // 3. Validation: POST /tasks with missing title
    console.log('\nTesting POST /tasks (Missing Title)...');
    const missingTitleRes = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        description: 'This is a description that is long enough, more than twenty characters.'
      })
    });
    const missingTitleData = await missingTitleRes.json();
    assert.strictEqual(missingTitleRes.status, 400);
    assert(missingTitleData.error.includes('Title is required'));
    console.log('✓ Validation passed: Missing Title rejected');

    // 4. Validation: POST /tasks with short description
    console.log('\nTesting POST /tasks (Short Description)...');
    const shortDescRes = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Valid Title',
        description: 'Too short'
      })
    });
    const shortDescData = await shortDescRes.json();
    assert.strictEqual(shortDescRes.status, 400);
    assert(shortDescData.error.includes('Description must be at least 20 characters'));
    console.log('✓ Validation passed: Short Description rejected');

    // 5. Valid POST /tasks
    console.log('\nTesting POST /tasks (Valid payload)...');
    const testTask = {
      title: 'Integration Test Task',
      description: 'This is a description that is long enough to pass the 20 character requirement.',
      status: 'Pending'
    };
    const createRes = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testTask)
    });
    const createdTask = await createRes.json();
    assert.strictEqual(createRes.status, 201);
    assert.ok(createdTask.id);
    assert.strictEqual(createdTask.title, testTask.title);
    assert.strictEqual(createdTask.status, testTask.status);
    console.log(`✓ POST /tasks passed: Created task with ID ${createdTask.id}`);

    const taskId = createdTask.id;

    // 6. Validation: PUT /tasks/:id (Invalid status)
    console.log('\nTesting PUT /tasks/:id (Invalid Status)...');
    const invalidStatusRes = await fetch(`${BASE_URL}/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'InvalidStatus' })
    });
    const invalidStatusData = await invalidStatusRes.json();
    assert.strictEqual(invalidStatusRes.status, 400);
    console.log('✓ Validation passed: Invalid Status rejected');

    // 7. Valid PUT /tasks/:id (Update status to Completed)
    console.log('\nTesting PUT /tasks/:id (Valid Status: Completed)...');
    const updateRes = await fetch(`${BASE_URL}/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Completed' })
    });
    const updateData = await updateRes.json();
    assert.strictEqual(updateRes.status, 200);
    assert.strictEqual(updateData.task.status, 'Completed');
    console.log('✓ PUT /tasks/:id passed: Updated status to Completed');

    // 8. DELETE /tasks/:id
    console.log('\nTesting DELETE /tasks/:id...');
    const deleteRes = await fetch(`${BASE_URL}/tasks/${taskId}`, {
      method: 'DELETE'
    });
    const deleteData = await deleteRes.json();
    assert.strictEqual(deleteRes.status, 200);
    assert.strictEqual(deleteData.message, 'Task deleted successfully');
    console.log('✓ DELETE /tasks/:id passed');

    // 9. Verify deletion (GET tasks should not contain this task ID)
    console.log('\nVerifying deletion...');
    const verifyGetRes = await fetch(`${BASE_URL}/tasks`);
    const verifyTasks = await verifyGetRes.json();
    const found = verifyTasks.find(t => t.id === taskId);
    assert.strictEqual(found, undefined);
    console.log('✓ Task deletion successfully verified');

    console.log('\n--- All API Verification Tests Passed! ---');
    process.exit(0);
  } catch (error) {
    console.error('\nFAIL: API Verification failed!');
    console.error(error);
    process.exit(1);
  }
}

runTests();
