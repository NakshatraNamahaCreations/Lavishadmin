// Fixed getTickets function with proper search handling
export const getTickets = async (req, res) => {
    try {
        const { page = 1, limit = 10, search } = req.query;
        const skip = (page - 1) * limit;

        console.log('getTickets called with params:', { page, limit, search });

        // Build search query - FIXED VERSION
        let query = {};
        
        if (search && search.trim() !== '') {
            const searchTerm = search.trim();
            console.log('Search term:', searchTerm);
            
            // Create a safer search query
            query = {
                $or: [
                    { orderId: { $regex: searchTerm, $options: 'i' } },
                    { mobileNumber: { $regex: searchTerm, $options: 'i' } }
                ]
            };
            
            console.log('Search query:', JSON.stringify(query));
        }

        // Test the query first with a simple find
        console.log('Testing query with find...');
        const testQuery = await Ticket.find(query).limit(1);
        console.log('Test query result:', testQuery.length, 'documents found');

        // Get total count for pagination
        console.log('Counting documents...');
        const total = await Ticket.countDocuments(query);
        console.log('Total documents found:', total);

        // Get paginated and filtered tickets
        console.log('Fetching paginated tickets...');
        const tickets = await Ticket.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .lean();

        console.log('Tickets fetched successfully:', tickets.length);

        res.status(200).json({
            success: true,
            tickets,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error in getTickets:', error);
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        
        // More specific error handling
        if (error.name === 'CastError') {
            return res.status(400).json({ 
                success: false, 
                error: 'Invalid parameter format: ' + error.message 
            });
        }
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                success: false, 
                error: 'Validation error: ' + error.message 
            });
        }
        
        res.status(500).json({ 
            success: false, 
            error: 'Search query error: ' + error.message 
        });
    }
};

// Alternative version with step-by-step debugging
export const getTicketsDebug = async (req, res) => {
    try {
        const { page = 1, limit = 10, search } = req.query;
        const skip = (page - 1) * limit;

        console.log('=== DEBUG: getTicketsDebug ===');
        console.log('Request params:', { page, limit, search });

        let query = {};
        
        // Step 1: Check if search parameter exists
        if (search) {
            console.log('Step 1: Search parameter exists:', search);
            console.log('Step 1: Search type:', typeof search);
            console.log('Step 1: Search length:', search.length);
            
            if (search.trim() !== '') {
                console.log('Step 2: Search is not empty, building query...');
                
                const searchTerm = search.trim();
                console.log('Step 2: Trimmed search term:', searchTerm);
                
                // Step 3: Build query step by step
                const orderIdQuery = { orderId: { $regex: searchTerm, $options: 'i' } };
                const mobileQuery = { mobileNumber: { $regex: searchTerm, $options: 'i' } };
                
                console.log('Step 3: OrderId query:', JSON.stringify(orderIdQuery));
                console.log('Step 3: Mobile query:', JSON.stringify(mobileQuery));
                
                query = {
                    $or: [orderIdQuery, mobileQuery]
                };
                
                console.log('Step 3: Final query:', JSON.stringify(query));
            } else {
                console.log('Step 2: Search is empty after trim, using empty query');
            }
        } else {
            console.log('Step 1: No search parameter provided');
        }

        // Step 4: Test query with findOne first
        console.log('Step 4: Testing query with findOne...');
        try {
            const testResult = await Ticket.findOne(query);
            console.log('Step 4: Test result:', testResult ? 'Found document' : 'No document found');
        } catch (testError) {
            console.error('Step 4: Test query failed:', testError.message);
            return res.status(500).json({ 
                success: false, 
                error: 'Query test failed: ' + testError.message 
            });
        }

        // Step 5: Get count
        console.log('Step 5: Getting document count...');
        const total = await Ticket.countDocuments(query);
        console.log('Step 5: Total count:', total);

        // Step 6: Get paginated results
        console.log('Step 6: Getting paginated results...');
        const tickets = await Ticket.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .lean();

        console.log('Step 6: Results fetched:', tickets.length);
        console.log('=== DEBUG END ===');

        res.status(200).json({
            success: true,
            tickets,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('=== DEBUG ERROR ===');
        console.error('Error in getTicketsDebug:', error);
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        console.error('=== DEBUG ERROR END ===');
        
        res.status(500).json({ 
            success: false, 
            error: 'Debug error: ' + error.message 
        });
    }
}; 