/*
  Create a Dashboard for Activation analysis

  Added Updates:
    1. Type Inferfaces to explictly set token to `Token` instead of `any`, Type annotations for functions,
       Replaced `"` with &quot;
*/

'use client'

import React, { useState, useCallback } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from 'recharts'

// Color constants for consistent theming
const THEME = {
    baseline: {
        primary: '#3b82f6', // Blue-500
        light: '#dbeafe', // Blue-100
        medium: '#60a5fa', // Blue-400
        border: '#bfdbfe', // Blue-200
    },
    steered: {
        primary: '#22c55e', // Green-500
        light: '#dcfce7', // Green-100
        medium: '#4ade80', // Green-400
        border: '#bbf7d0', // Green-200
    },
}

// Type Interfaces
interface NeuronActivation {
    neuron: string
    activation: number
}

interface Token {
    token: string
    topk_neuron_activations: NeuronActivation[]
    topk_next_tokens: Record<string, number>[]
}

interface TokenAnalysisProps {
    token: Token
    isSteered: boolean
}

const TokenAnalysis: React.FC<TokenAnalysisProps> = ({ token, isSteered }) => {
    if (!token) return null

    const theme = isSteered ? THEME.steered : THEME.baseline
    const neuronData = token.topk_neuron_activations.map((n) => ({
        name: n.neuron,
        value: n.activation,
    }))

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-2">
                    Top Neuron Activations
                </h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={neuronData} margin={{ bottom: 90 }}>
                            <XAxis
                                dataKey="name"
                                angle={-45}
                                textAnchor="end"
                                height={80}
                                interval={0}
                            />
                            <YAxis />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: theme.light,
                                    borderColor: theme.border,
                                }}
                            />
                            <Bar
                                dataKey="value"
                                fill={theme.primary}
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-2">
                    Next Token Probabilities
                </h3>
                <div className="max-h-64 overflow-y-auto">
                    <table className="w-full">
                        <thead className="sticky top-0 bg-white">
                            <tr>
                                <th className="text-left p-2 border-b">
                                    Token
                                </th>
                                <th className="text-left p-2 border-b">
                                    Probability
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {token.topk_next_tokens.map((t, index) => (
                                <tr
                                    key={index}
                                    className="border-b hover:bg-gray-50"
                                >
                                    <td className="p-2 font-mono">
                                        {Object.keys(t)[0]}
                                    </td>
                                    <td className="p-2">
                                        {Object.values(t)[0].toFixed(4)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

const ActivationDashboard: React.FC = () => {
    const [baselineTokens, setBaselineTokens] = useState<Token[]>([])
    const [steeredTokens, setSteeredTokens] = useState<Token[]>([])
    const [selectedBaselineIndex, setSelectedBaselineIndex] = useState<
        number | null
    >(null)
    const [selectedSteeredIndex, setSelectedSteeredIndex] = useState<
        number | null
    >(null)

    const handleFileUpload = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>, isSteered: boolean) => {
            const file = event.target.files?.[0]
            if (!file) return

            const reader = new FileReader()
            reader.onload = (e: ProgressEvent<FileReader>) => {
                try {
                    // Add null check for e.target and e.target.result
                    if (!e.target?.result) return

                    const data = JSON.parse(
                        e.target.result.toString()
                    ) as Token[]

                    if (isSteered) {
                        setSteeredTokens(data)
                        setSelectedSteeredIndex(null)
                    } else {
                        setBaselineTokens(data)
                        setSelectedBaselineIndex(null)
                    }
                } catch (error) {
                    console.error('Error parsing JSON:', error)
                }
            }
            reader.readAsText(file)
        },
        []
    )

    const handleBaselineFileUpload = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            handleFileUpload(event, false)
        },
        [handleFileUpload]
    )

    const handleSteeredFileUpload = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            handleFileUpload(event, true)
        },
        [handleFileUpload]
    )

    return (
        <div className="w-full max-w-6xl space-y-4">
            {/* Main Title */}
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-1">
                    Response Analysis Dashboard
                </h1>
                <p className="text-gray-600">
                    Compare Baseline and Steered Response Patterns
                </p>
            </div>

            {/* File Upload Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Upload Response Files</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        <div
                            className="p-4 rounded-lg border-2"
                            style={{ borderColor: THEME.baseline.border }}
                        >
                            <label
                                className="block text-sm font-medium mb-2"
                                style={{ color: THEME.baseline.primary }}
                            >
                                Baseline Response JSON
                            </label>
                            <input
                                type="file"
                                accept=".json"
                                onChange={handleBaselineFileUpload}
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold"
                                style={
                                    {
                                        '--tw-file-bg': THEME.baseline.light,
                                        '--tw-file-color':
                                            THEME.baseline.primary,
                                    } as React.CSSProperties
                                }
                            />
                        </div>
                        <div
                            className="p-4 rounded-lg border-2"
                            style={{ borderColor: THEME.steered.border }}
                        >
                            <label
                                className="block text-sm font-medium mb-2"
                                style={{ color: THEME.steered.primary }}
                            >
                                Steered Response JSON
                            </label>
                            <input
                                type="file"
                                accept=".json"
                                onChange={handleSteeredFileUpload}
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold"
                                style={
                                    {
                                        '--tw-file-bg': THEME.steered.light,
                                        '--tw-file-color':
                                            THEME.steered.primary,
                                    } as React.CSSProperties
                                }
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Response and Analysis Grid */}
            {(baselineTokens.length > 0 || steeredTokens.length > 0) && (
                <div className="grid grid-cols-2 gap-4">
                    {/* Token Selection Row */}
                    <Card
                        className="border-2"
                        style={{ borderColor: THEME.baseline.border }}
                    >
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center">
                                <div
                                    className="h-3 w-3 rounded-full mr-2"
                                    style={{
                                        backgroundColor: THEME.baseline.primary,
                                    }}
                                ></div>
                                Baseline Response
                                {selectedBaselineIndex !== null && (
                                    <span className="text-sm font-baseline ml-2">
                                        (Selected: &quot;
                                        {
                                            baselineTokens[
                                                selectedBaselineIndex
                                            ].token
                                        }
                                        &quot;)
                                    </span>
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-1">
                                {baselineTokens.map((token, index) => (
                                    <button
                                        key={index}
                                        onClick={() =>
                                            setSelectedBaselineIndex(index)
                                        }
                                        className={`px-2 py-1 rounded font-mono text-sm transition-colors ${
                                            selectedBaselineIndex === index
                                                ? 'text-white'
                                                : 'border hover:bg-opacity-10'
                                        }`}
                                        style={{
                                            backgroundColor:
                                                selectedBaselineIndex === index
                                                    ? THEME.baseline.primary
                                                    : 'white',
                                            borderColor: THEME.baseline.border,
                                            color:
                                                selectedBaselineIndex === index
                                                    ? 'white'
                                                    : THEME.baseline.primary,
                                        }}
                                    >
                                        {token.token}
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card
                        className="border-2"
                        style={{ borderColor: THEME.steered.border }}
                    >
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center">
                                <div
                                    className="h-3 w-3 rounded-full mr-2"
                                    style={{
                                        backgroundColor: THEME.steered.primary,
                                    }}
                                ></div>
                                Steered Response
                                {selectedSteeredIndex !== null && (
                                    <span className="text-sm font-baseline ml-2">
                                        (Selected: &quot;
                                        {
                                            steeredTokens[selectedSteeredIndex]
                                                .token
                                        }
                                        &quot;)
                                    </span>
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-1">
                                {steeredTokens.map((token, index) => (
                                    <button
                                        key={index}
                                        onClick={() =>
                                            setSelectedSteeredIndex(index)
                                        }
                                        className={`px-2 py-1 rounded font-mono text-sm transition-colors ${
                                            selectedSteeredIndex === index
                                                ? 'text-white'
                                                : 'border hover:bg-opacity-10'
                                        }`}
                                        style={{
                                            backgroundColor:
                                                selectedSteeredIndex === index
                                                    ? THEME.steered.primary
                                                    : 'white',
                                            borderColor: THEME.steered.border,
                                            color:
                                                selectedSteeredIndex === index
                                                    ? 'white'
                                                    : THEME.steered.primary,
                                        }}
                                    >
                                        {token.token}
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Analysis Row */}
                    <Card
                        className="h-full border-2"
                        style={{ borderColor: THEME.baseline.border }}
                    >
                        <CardHeader>
                            <CardTitle>
                                {selectedBaselineIndex !== null
                                    ? `Analysis for "${baselineTokens[selectedBaselineIndex].token}"`
                                    : 'Select a token to view analysis'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {selectedBaselineIndex !== null ? (
                                <TokenAnalysis
                                    token={
                                        baselineTokens[selectedBaselineIndex]
                                    }
                                    isSteered={false}
                                />
                            ) : (
                                <div className="text-center text-gray-500 py-8">
                                    Click on a token above to view its analysis
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card
                        className="h-full border-2"
                        style={{ borderColor: THEME.steered.border }}
                    >
                        <CardHeader>
                            <CardTitle>
                                {selectedSteeredIndex !== null
                                    ? `Analysis for "${steeredTokens[selectedSteeredIndex].token}"`
                                    : 'Select a token to view analysis'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {selectedSteeredIndex !== null ? (
                                <TokenAnalysis
                                    token={steeredTokens[selectedSteeredIndex]}
                                    isSteered={true}
                                />
                            ) : (
                                <div className="text-center text-gray-500 py-8">
                                    Click on a token above to view its analysis
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}

export default ActivationDashboard
